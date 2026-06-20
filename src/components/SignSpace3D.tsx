import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Edges, Grid, useAnimations, useGLTF } from "@react-three/drei";
import CameraControlsImpl from "camera-controls";
import { SkeletonUtils } from "three-stdlib";
import { Box3, DoubleSide, Group, type Material, Mesh, type Object3D, Quaternion, Vector3 } from "three";
import { asset } from "../lib/asset";

const AVATAR_URL = asset("/models/remy.glb");
const IDLE_URL = asset("/models/remy-idle.glb");
const AVATAR_HEIGHT = 1.7;
// Y up; the avatar faces +Z (toward the viewer / front wall), feet at y = 0.
const VIEW_34: [number, number, number] = [2.4, 1.8, 2.6];
const DEFAULT_ZOOM = 1.5;
const FALLBACK_TARGET_Y = AVATAR_HEIGHT / 2;

type Layer = "box" | "wall" | "floor" | "diagonal" | "diagonal-down" | "none";
type View = "34" | "top" | "front" | "back" | "side";
type Plane = "wall" | "floor";

// Wall-plane movement directions (8 around a circle), CCW from straight up.
const WALL_ROSE: { symbol: string; angle: number; label: string }[] = [
  { symbol: "񆿁", angle: 90, label: "Up" },
  { symbol: "񆿂", angle: 135, label: "Up Diagonal" },
  { symbol: "񆿃", angle: 180, label: "Left" },
  { symbol: "񆿄", angle: 225, label: "Down Diagonal" },
  { symbol: "񆿅", angle: 270, label: "Down" },
  { symbol: "񆿆", angle: 315, label: "Down Diagonal" },
  { symbol: "񆿇", angle: 0, label: "Right" },
  { symbol: "񆿈", angle: 45, label: "Up Diagonal" },
];

// Floor-plane movement directions (single-stemmed): forward/back replace
// up/down, while left/right stay identical to the wall plane (shared X axis).
const FLOOR_ROSE: { symbol: string; angle: number; label: string }[] = [
  { symbol: "񈗡", angle: 90, label: "Forward" },
  { symbol: "񈗢", angle: 135, label: "Forward Diagonal" },
  { symbol: "񈗣", angle: 180, label: "Left" },
  { symbol: "񈗤", angle: 225, label: "Backward Diagonal" },
  { symbol: "񈗥", angle: 270, label: "Backward" },
  { symbol: "񈗦", angle: 315, label: "Backward Diagonal" },
  { symbol: "񈗧", angle: 0, label: "Right" },
  { symbol: "񈗨", angle: 45, label: "Forward Diagonal" },
];

// Wall-plane CURVED movement directions: the curved counterpart of WALL_ROSE.
// All one curve (base S288) in its eight mirrored rotations, placed tangentially
// around the ring — the setup is rotated 90° CCW from the glyphs' own pointing
// direction (the curve that points right sits at the top). Shown symbol-only.
const WALL_CURVE_ROSE: { symbol: string; angle: number }[] = [
  { symbol: "񉌍", angle: 0 },
  { symbol: "񉌌", angle: 45 },
  { symbol: "񉌋", angle: 90 },
  { symbol: "񉌊", angle: 135 },
  { symbol: "񉌉", angle: 180 },
  { symbol: "񉌐", angle: 225 },
  { symbol: "񉌏", angle: 270 },
  { symbol: "񉌎", angle: 315 },
];

// Forward-Over / Back-Over curves, shown in a side-profile scene: three arcs
// over the top (forward, rotations 2/0/7) and three under (back, rotations
// 6/5/3). Laid out 3 across the top of the ring and 3 across the bottom; the
// left button leans 45° left, middle goes straight, right leans 45° right.
const OVER_ROSE: { symbol: string; angle: number }[] = [
  { symbol: "񊒣", angle: 135 },
  { symbol: "񊒡", angle: 90 },
  { symbol: "񊒨", angle: 45 },
  { symbol: "񊒧", angle: 225 },
  { symbol: "񊒦", angle: 270 },
  { symbol: "񊒤", angle: 315 },
];

// The Forward-Under / Back-Under counterpart (Floor curve base S2c6): same six
// directions, but the arc dips down under instead of arcing up over.
const UNDER_ROSE: { symbol: string; angle: number }[] = [
  { symbol: "񊩃", angle: 135 },
  { symbol: "񊩁", angle: 90 },
  { symbol: "񊩈", angle: 45 },
  { symbol: "񊩇", angle: 225 },
  { symbol: "񊩆", angle: 270 },
  { symbol: "񊩄", angle: 315 },
];

const LAYER_COLOR: Record<Layer, string> = {
  box: "#3b82f6",
  wall: "#e0584f",
  floor: "#2f9e57",
  diagonal: "#8b5cf6",
  "diagonal-down": "#8b5cf6",
  none: "#64748b",
};

type Measure = {
  shoulderWidth: number;
  hipY: number;
  headTopY: number;
  neckY: number;
};

type Dims = {
  width: number; // 2.5× shoulder width
  height: number; // hips → top of head, +15 cm each end
  centerY: number;
  hipY: number;
};

function dimsFromMeasure(m: Measure): Dims {
  const yBottom = m.hipY - 0.15;
  const yTop = m.headTopY + 0.15;
  return {
    width: 2.5 * m.shoulderWidth,
    height: yTop - yBottom,
    centerY: (yTop + yBottom) / 2,
    hipY: m.hipY,
  };
}

function findBone(root: Object3D, key: string): Object3D | undefined {
  let found: Object3D | undefined;
  root.traverse((obj) => {
    if (!found && obj.name.toLowerCase().includes(key)) found = obj;
  });
  return found;
}

type ArmChain = { shoulder: Object3D; elbow: Object3D; hand: Object3D };
type ArmRig = { chain: ArmChain; shoulder0: Vector3; upper: number; fore: number };
type Hand = "right" | "left";
type Side = Hand | "both";

// Reusable scratch objects so the per-frame IK solver never allocates.
const _S = new Vector3();
const _d = new Vector3();
const _u = new Vector3();
const _v = new Vector3();
const _E = new Vector3();
const _Epos = new Vector3();
const _clampTarget = new Vector3();
const _aimFrom = new Vector3();
const _aimTo = new Vector3();
const _childPos = new Vector3();
const _neutral = new Vector3();
const _dir = new Vector3();
const _dest = new Vector3();
const _target = new Vector3();
const _qRot = new Quaternion();
const _qWorld = new Quaternion();
const _qParent = new Quaternion();
const _traceA = new Vector3();
const _traceB = new Vector3();
const _base = new Vector3();
const _UP = new Vector3(0, 1, 0);

// The elbow bends toward this world direction (down and back), so the pole
// stays stable as the wrist target moves around the wall plane.
const ARM_POLE = new Vector3(0, -1, -0.5).normalize();

// Neutral pose tilts the upper arm forward so the elbow sits this far (metres)
// ahead of the shoulder instead of hanging straight down — a more natural rest.
const ELBOW_FORWARD = 0.1;

// World-space direction for a rose angle, fixed in the signer's (expressive)
// frame: the symbols mean the signer's own up/down/left/right, so "Right"
// (angle 0) is the signer's right = world −X (they face +Z). From the back
// camera this reads directly; from the front camera it appears mirrored.
function roseDirection(angle: number, out: Vector3): Vector3 {
  const rad = (angle * Math.PI) / 180;
  return out.set(-Math.cos(rad), Math.sin(rad), 0);
}

// Floor-plane direction: same X as the wall plane (left/right are the shared
// edge of both planes), but the vertical term drives forward/back (+Z = away
// from the chest) instead of up/down.
function floorDirection(angle: number, out: Vector3): Vector3 {
  const rad = (angle * Math.PI) / 180;
  return out.set(-Math.cos(rad), 0, Math.sin(rad));
}

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

const GESTURE_OUT = 0.5;
const GESTURE_HOLD = 0.5;
const GESTURE_BACK = 0.5;
const GESTURE_TOTAL = GESTURE_OUT + GESTURE_HOLD + GESTURE_BACK;
// How far the hand travels from neutral on a gesture, as a fraction of arm
// length (clamped to the arm's length by the IK). Used by the Up-Down /
// Forward-Back scenes.
const GESTURE_REACH = 0.45;
// The over-arc adds an upward bulge on top of its forward travel, so its peak
// sits farther from the shoulder than a straight reach of the same distance.
// A smaller fraction keeps the whole semicircle inside the arm's reach instead
// of clipping flat where the IK clamps to full extension.
const OVER_REACH = 0.4;
// Retract the arc's near end this far back toward the chest (fraction of arm
// length) so the forward sweep starts from a pulled-in pose, freeing reach for
// the full semicircle instead of clipping at extension.
const OVER_START_BACK = 0.2;
// How far the left/right buttons lean the forward direction off straight ahead.
const OVER_LEAN_DEG = 70;
// Radius (m) of the circle the curved-movement scene draws at, and traces, the
// wrist around. Shared by WristCircle (the drawn ring) and driveArmCurve.
const WRIST_CIRCLE_R = 0.2;
// Raise the wrist circle (and the arc it traces) this far above the resting
// wrist, so it sits a little higher over the signing area.
const WRIST_CIRCLE_LIFT = 0.1;
// Each rose button owns one of the circle's eight pieces. The pieces are 90°
// wide (±this from the button angle), so neighbours overlap — a fuller, more
// legible sweep of the curve than tight non-overlapping 45° slices.
const CURVE_ARC_HALF = 45;

type Gesture = { angle: number; id: number };

// Rotate `bone` about `pivot` so its `child` joint points at `targetPoint`.
// Pure rotation preserves the bone length, so the child lands exactly on the
// target whenever the target sits at the bone's length from the pivot.
function aimBoneAt(bone: Object3D, pivot: Vector3, child: Object3D, targetPoint: Vector3) {
  child.getWorldPosition(_childPos);
  _aimFrom.subVectors(_childPos, pivot);
  _aimTo.subVectors(targetPoint, pivot);
  if (_aimFrom.lengthSq() < 1e-9 || _aimTo.lengthSq() < 1e-9) return;
  _aimFrom.normalize();
  _aimTo.normalize();
  _qRot.setFromUnitVectors(_aimFrom, _aimTo);
  bone.getWorldQuaternion(_qWorld);
  _qWorld.premultiply(_qRot);
  const parent = bone.parent;
  if (parent) {
    parent.getWorldQuaternion(_qParent);
    bone.quaternion.copy(_qParent.invert().multiply(_qWorld));
  } else {
    bone.quaternion.copy(_qWorld);
  }
  bone.updateMatrixWorld(true);
}

// Force a bone to a fixed world orientation (used to keep the hand's facing
// steady while the shoulder/elbow move the wrist), converting through the
// parent so the local quaternion lands the requested world rotation.
function setWorldQuaternion(bone: Object3D, q: Quaternion) {
  const parent = bone.parent;
  if (parent) {
    parent.getWorldQuaternion(_qParent);
    bone.quaternion.copy(_qParent.invert().multiply(q));
  } else {
    bone.quaternion.copy(q);
  }
  bone.updateMatrixWorld(true);
}

// Analytic two-bone IK: places the wrist exactly on `target` (when reachable)
// with the elbow on the ARM_POLE side. Runs after the mixer, so it overrides
// the idle arm pose while the rest of the body keeps breathing.
function solveArmTwoBone(chain: ArmChain, target: Vector3, l1: number, l2: number) {
  const S = chain.shoulder.getWorldPosition(_S);
  _d.subVectors(target, S);
  let dist = _d.length();
  if (dist < 1e-5) return;
  _u.copy(_d).divideScalar(dist);
  dist = Math.max(Math.abs(l1 - l2) + 1e-3, Math.min((l1 + l2) * 0.999, dist));
  _clampTarget.copy(S).addScaledVector(_u, dist);

  // Bend direction: the pole projected perpendicular to the shoulder→wrist axis.
  _v.copy(ARM_POLE).addScaledVector(_u, -ARM_POLE.dot(_u));
  if (_v.lengthSq() < 1e-6) {
    _v.set(0, 0, -1).addScaledVector(_u, -_u.z);
    if (_v.lengthSq() < 1e-6) _v.set(1, 0, 0).addScaledVector(_u, -_u.x);
  }
  _v.normalize();

  const cosA = Math.max(-1, Math.min(1, (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist)));
  const a = Math.acos(cosA);
  _E.copy(S)
    .addScaledVector(_u, Math.cos(a) * l1)
    .addScaledVector(_v, Math.sin(a) * l1);

  aimBoneAt(chain.shoulder, S, chain.elbow, _E);
  chain.elbow.getWorldPosition(_Epos);
  aimBoneAt(chain.elbow, _Epos, chain.hand, _clampTarget);
}

// Pose one arm: build its forward-tilted neutral, blend toward the gesture
// target by `mix` (0 = neutral, 1 = full reach), then solve. `angle` null holds
// neutral. Driven per arm so a "both" gesture moves the two hands in parallel.
// The forward-tilted rest position of the wrist: the centre of the wrist circle
// and where every gesture starts and ends.
function neutralWrist(rig: ArmRig, out: Vector3): Vector3 {
  const { shoulder0: s0, upper, fore } = rig;
  const elbowFwd = Math.min(upper * 0.9, ELBOW_FORWARD);
  const elbowDrop = Math.sqrt(Math.max(0, upper * upper - elbowFwd * elbowFwd));
  return out.set(s0.x, s0.y - elbowDrop, s0.z + fore + elbowFwd);
}

function driveArm(rig: ArmRig, plane: Plane, angle: number | null, mix: number) {
  const { chain, upper, fore } = rig;
  neutralWrist(rig, _neutral);
  _target.copy(_neutral);

  if (angle !== null && mix > 0) {
    // Reach a fraction of arm length in the rose direction. We don't cap to the
    // uniform always-reachable radius (which is small — the arm rests nearly
    // extended); solveArmTwoBone clamps an over-long target to the arm's length,
    // so extreme directions stop at full extension instead, a far larger move.
    const reach = (upper + fore) * GESTURE_REACH;
    (plane === "floor" ? floorDirection : roseDirection)(angle, _dir);
    _dest.copy(_neutral).addScaledVector(_dir, reach);
    _target.lerpVectors(_neutral, _dest, mix);
  }
  solveArmTwoBone(chain, _target, upper, fore);
}

// Trace one 45° piece of the wrist circle, the curved movement the symbol draws.
// `t` is the gesture's elapsed time: reach out from the circle centre to the arc
// start (button angle + half), trace clockwise (decreasing angle) through the
// button angle to the end (angle − half), then return to centre. roseDirection
// places the arc in the wall plane in the back-view frame, so from the back the
// top button runs top-left → top → top-right.
function driveArmCurve(rig: ArmRig, angle: number, t: number, hold?: Quaternion) {
  const { chain, upper, fore } = rig;
  neutralWrist(rig, _neutral);
  // Arc points sit on the circle centred LIFT above the resting wrist; the
  // out/back phases still lerp to the true rest so the hand never jumps.
  const cx = _neutral.x;
  const cy = _neutral.y + WRIST_CIRCLE_LIFT;
  const cz = _neutral.z;
  const start = angle + CURVE_ARC_HALF;
  const end = angle - CURVE_ARC_HALF;
  if (t < GESTURE_OUT) {
    roseDirection(start, _dir);
    _dest.set(cx, cy, cz).addScaledVector(_dir, WRIST_CIRCLE_R);
    _target.lerpVectors(_neutral, _dest, smoothstep(t / GESTURE_OUT));
  } else if (t < GESTURE_OUT + GESTURE_HOLD) {
    const k = smoothstep((t - GESTURE_OUT) / GESTURE_HOLD);
    roseDirection(start + (end - start) * k, _dir);
    _target.set(cx, cy, cz).addScaledVector(_dir, WRIST_CIRCLE_R);
  } else if (t < GESTURE_TOTAL) {
    roseDirection(end, _dir);
    _dest.set(cx, cy, cz).addScaledVector(_dir, WRIST_CIRCLE_R);
    _target.lerpVectors(_dest, _neutral, smoothstep((t - GESTURE_OUT - GESTURE_HOLD) / GESTURE_BACK));
  } else {
    _target.copy(_neutral);
  }
  solveArmTwoBone(chain, _target, upper, fore);
  // Keep the hand's facing constant: the shoulder/elbow move the wrist along the
  // arc, the wrist absorbs the swing instead of the hand spinning (which the
  // incremental aim would otherwise accumulate as axial roll).
  if (hold) setWorldQuaternion(chain.hand, hold);
}

// Place a point on the forward "over" half-circle. The arc starts at the
// resting wrist `p0`, bulges up, and ends a forward distance D = 2R away along
// `dir` at the same height. u ∈ [0,1] runs start→end.
function overArcPoint(
  p0: Vector3,
  dir: Vector3,
  r: number,
  u: number,
  vy: number,
  out: Vector3,
): Vector3 {
  return out
    .copy(p0)
    .addScaledVector(dir, r * (1 - Math.cos(Math.PI * u)))
    .addScaledVector(_UP, vy * r * Math.sin(Math.PI * u));
}

// Drive one arm through a Forward-Over (or Back-Over) half-circle. The hand
// travels the same forward distance as the Forward-Back reach, but over a
// semicircular arc instead of a straight line. `angle` is the rose-button angle:
// the lower half (sin < 0) reverses the traversal (back-over, starting from the
// extended hand), and the horizontal lean (cos) deviates the forward direction
// 45° to the signer's left or right.
// The over-arc's near end: the resting wrist pulled back toward the chest, so
// the semicircle has room to sweep forward. This is the scene's rest pose too —
// the retraction is a starting position, not part of the animation.
function overBase(rig: ArmRig, out: Vector3): Vector3 {
  neutralWrist(rig, out);
  out.z -= (rig.upper + rig.fore) * OVER_START_BACK;
  return out;
}

function driveArmOverRest(rig: ArmRig) {
  overBase(rig, _target);
  solveArmTwoBone(rig.chain, _target, rig.upper, rig.fore);
}

function driveArmOver(rig: ArmRig, angle: number, t: number, down: boolean, hold?: Quaternion) {
  const { chain, upper, fore } = rig;
  overBase(rig, _base);
  const rad = (angle * Math.PI) / 180;
  const reversed = Math.sin(rad) < 0;
  const c = Math.cos(rad);
  const lean = c < -0.01 ? 1 : c > 0.01 ? -1 : 0; // +1 = signer-left (+X)
  const sx = lean * Math.sin((OVER_LEAN_DEG * Math.PI) / 180);
  _dir.set(sx, 0, Math.sqrt(Math.max(0, 1 - sx * sx)));
  const r = ((upper + fore) * OVER_REACH) / 2;
  const vy = down ? -1 : 1; // arc dips under (Back/Forward-Under) vs over

  if (t < GESTURE_OUT) {
    overArcPoint(_base, _dir, r, reversed ? 1 : 0, vy, _dest);
    _target.lerpVectors(_base, _dest, smoothstep(t / GESTURE_OUT));
  } else if (t < GESTURE_OUT + GESTURE_HOLD) {
    const k = smoothstep((t - GESTURE_OUT) / GESTURE_HOLD);
    overArcPoint(_base, _dir, r, reversed ? 1 - k : k, vy, _target);
  } else if (t < GESTURE_TOTAL) {
    overArcPoint(_base, _dir, r, reversed ? 0 : 1, vy, _dest);
    _target.lerpVectors(_dest, _base, smoothstep((t - GESTURE_OUT - GESTURE_HOLD) / GESTURE_BACK));
  } else {
    _target.copy(_base);
  }
  solveArmTwoBone(chain, _target, upper, fore);
  if (hold) setWorldQuaternion(chain.hand, hold);
}

function Avatar({
  onMeasure,
  arm,
  xray,
  side = "right",
  plane = "wall",
  circle = false,
  motion = "reach",
}: {
  onMeasure: (m: Measure) => void;
  arm?: { gesture: Gesture | null };
  xray?: boolean;
  side?: Side;
  plane?: Plane;
  circle?: boolean;
  motion?: "reach" | "curve" | "over" | "under";
}) {
  const { scene } = useGLTF(AVATAR_URL);
  const { animations } = useGLTF(IDLE_URL);
  // Clone per instance (skeleton-aware) so each viewer animates independently.
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, model);
  // One rig per arm; the active hand is chosen by `side` each frame. The fixed
  // shoulder anchor keeps breathing from drifting the off-axis wrist coords.
  const rigs = useRef<Record<Hand, ArmRig> | null>(null);
  const playing = useRef<{ angle: number; id: number; start: number } | null>(null);
  const startedId = useRef<number | null>(null);
  // Wrist circles (one per hand) and the side they were last snapped to. The
  // circle anchors to the active hand's resting wrist once, then stays put.
  const circleRef = useRef<Record<Hand, Group | null>>({ right: null, left: null });
  const highlightRef = useRef<Record<Hand, Mesh | null>>({ right: null, left: null });
  const traceRef = useRef<Record<Hand, Mesh | null>>({ right: null, left: null });
  const circleSide = useRef<Side | null>(null);
  // The hand's resting world orientation, recorded each idle frame and held
  // during a curve gesture so the hand keeps its facing as the wrist moves.
  const restHandQuat = useRef<Record<Hand, Quaternion>>({
    right: new Quaternion(),
    left: new Quaternion(),
  });
  // Per-instance material clones, so toggling x-ray here can't affect the
  // other viewers (SkeletonUtils.clone shares material references by default).
  const ownMats = useRef<Material[]>([]);
  const managesXray = xray !== undefined;

  useEffect(() => {
    model.scale.setScalar(1);
    const natural = new Vector3();
    new Box3().setFromObject(model).getSize(natural);
    model.scale.setScalar(AVATAR_HEIGHT / natural.y);
    const box = new Box3().setFromObject(model);
    model.position.set(
      -(box.min.x + box.max.x) / 2,
      -box.min.y,
      -(box.min.z + box.max.z) / 2,
    );
    ownMats.current = [];
    model.traverse((obj) => {
      obj.castShadow = true;
      if (managesXray && obj instanceof Mesh) {
        const owned = (Array.isArray(obj.material) ? obj.material : [obj.material]).map(
          (m: Material) => m.clone(),
        );
        obj.material = owned.length === 1 ? owned[0]! : owned;
        ownMats.current.push(...owned);
      }
    });
    model.updateMatrixWorld(true);

    const fit = new Box3().setFromObject(model);
    const buildRig = (s: Hand): ArmRig | null => {
      const shoulder = findBone(model, `${s}arm`);
      const elbow = findBone(model, `${s}forearm`);
      const hand = findBone(model, `${s}hand`);
      if (!shoulder || !elbow || !hand) return null;
      const sPos = new Vector3();
      const e = new Vector3();
      const w = new Vector3();
      shoulder.getWorldPosition(sPos);
      elbow.getWorldPosition(e);
      hand.getWorldPosition(w);
      return {
        chain: { shoulder, elbow, hand },
        shoulder0: sPos,
        upper: sPos.distanceTo(e),
        fore: e.distanceTo(w),
      };
    };
    const right = buildRig("right");
    const left = buildRig("left");
    if (right && left) rigs.current = { right, left };

    const hips = new Vector3();
    const neck = new Vector3();
    findBone(model, "hips")?.getWorldPosition(hips);
    findBone(model, "neck")?.getWorldPosition(neck);

    onMeasure({
      shoulderWidth: Math.abs((left?.shoulder0.x ?? 0.2) - (right?.shoulder0.x ?? -0.2)) || 0.4,
      hipY: hips.y || fit.max.y * 0.5,
      headTopY: fit.max.y,
      neckY: neck.y || fit.max.y * 0.85,
    });
  }, [model, onMeasure]);

  useEffect(() => {
    const name = names[0];
    const action = name ? actions[name] : null;
    action?.reset().play();
    return () => {
      action?.stop();
    };
  }, [actions, names]);

  useEffect(() => {
    for (const m of ownMats.current) {
      m.transparent = !!xray;
      m.opacity = xray ? 0.4 : 1;
      m.depthWrite = !xray;
      m.needsUpdate = true;
    }
  }, [xray]);

  // Switching hands clears any in-flight gesture so the newly idle arm is
  // released back to the breathing animation instead of freezing in place, and
  // re-arms the wrist circle to snap onto the newly active hand.
  useEffect(() => {
    playing.current = null;
    circleSide.current = null;
  }, [side]);

  // Runs after the mixer's own useFrame (registered earlier), so the IK pose
  // wins over the idle animation for the arm while the body keeps breathing.
  useFrame((state) => {
    if (!arm || !rigs.current) return;
    const now = state.clock.elapsedTime;
    const g = arm.gesture;
    // Start each gesture once. Tracking the id separately from playing.current
    // stops a finished gesture (cleared to null) from being re-triggered while
    // the same gesture prop is still set — which would loop it forever.
    if (g && startedId.current !== g.id) {
      startedId.current = g.id;
      playing.current = { angle: g.angle, id: g.id, start: now };
    }

    // Gesture phase, shared across hands: 0 = neutral, 1 = full reach.
    let mix = 0;
    const p = playing.current;
    if (p) {
      const t = now - p.start;
      if (t < GESTURE_OUT) mix = smoothstep(t / GESTURE_OUT);
      else if (t < GESTURE_OUT + GESTURE_HOLD) mix = 1;
      else if (t < GESTURE_TOTAL) mix = 1 - smoothstep((t - GESTURE_OUT - GESTURE_HOLD) / GESTURE_BACK);
      else playing.current = null;
    }
    const angle = p ? p.angle : null;

    const hands: Hand[] = side === "both" ? ["right", "left"] : [side];
    for (const h of hands) {
      const isOverUnder = motion === "over" || motion === "under";
      if (motion === "curve" || isOverUnder) {
        if (p) {
          if (motion === "curve") {
            driveArmCurve(rigs.current[h], p.angle, now - p.start, restHandQuat.current[h]);
          } else {
            driveArmOver(rigs.current[h], p.angle, now - p.start, motion === "under", restHandQuat.current[h]);
          }
        } else {
          if (isOverUnder) driveArmOverRest(rigs.current[h]);
          else driveArm(rigs.current[h], plane, null, 0);
          rigs.current[h].chain.hand.getWorldQuaternion(restHandQuat.current[h]);
        }
      } else {
        driveArm(rigs.current[h], plane, angle, mix);
      }
    }

    // Snap each wrist circle to the active hand once, while the arm is at rest
    // (mix 0), then leave it; it does not track the hand during a gesture.
    if (circle && circleSide.current !== side && mix === 0) {
      for (const h of ["right", "left"] as Hand[]) {
        const node = circleRef.current[h];
        if (!node) continue;
        const on = hands.includes(h);
        node.visible = on;
        if (on) {
          rigs.current[h].chain.hand.getWorldPosition(node.position);
          node.position.y += WRIST_CIRCLE_LIFT;
        }
      }
      circleSide.current = side;
    }

    // Light up the slice being traced for the duration of the gesture. The
    // 90°-wide base arc (geometry-angle 0…90°) is rotated so it covers the
    // wrist's path: screen angle α ↦ geometry angle 180−α, so the slice
    // [A−45, A+45] lands at [135−A, 225−A] → rotation.z = 135−A.
    if (circle) {
      for (const h of ["right", "left"] as Hand[]) {
        const hl = highlightRef.current[h];
        if (!hl) continue;
        const show = motion === "curve" && !!p && hands.includes(h);
        hl.visible = show;
        if (show) hl.rotation.z = ((135 - p!.angle) * Math.PI) / 180;
      }
    }

    // Trace the straight movement: a line from the wrist's rest position to its
    // current position, drawn while the gesture plays. Its direction (and the
    // wall/floor colour) make the plane of movement clear. A unit-height
    // cylinder is positioned at the segment midpoint, scaled to its length, and
    // aimed along it.
    if (motion === "reach") {
      for (const h of ["right", "left"] as Hand[]) {
        const line = traceRef.current[h];
        if (!line) continue;
        if (!p || !hands.includes(h)) {
          line.visible = false;
          continue;
        }
        neutralWrist(rigs.current[h], _traceA);
        rigs.current[h].chain.hand.getWorldPosition(_traceB);
        _dir.subVectors(_traceB, _traceA);
        const len = _dir.length();
        if (len < 1e-3) {
          line.visible = false;
          continue;
        }
        line.visible = true;
        line.position.copy(_traceA).addScaledVector(_dir, 0.5);
        line.quaternion.setFromUnitVectors(_UP, _dir.divideScalar(len));
        line.scale.set(1, len, 1);
      }
    }
  });

  return (
    <>
      <primitive object={model} />
      {circle && (
        <>
          <group ref={(g) => void (circleRef.current.right = g)} visible={false}>
            <WristCircle />
            <HighlightArc meshRef={(m) => void (highlightRef.current.right = m)} />
          </group>
          <group ref={(g) => void (circleRef.current.left = g)} visible={false}>
            <WristCircle />
            <HighlightArc meshRef={(m) => void (highlightRef.current.left = m)} />
          </group>
        </>
      )}
      {arm && motion === "reach" && (
        <>
          <mesh ref={(m) => void (traceRef.current.right = m)} visible={false}>
            <cylinderGeometry args={[0.008, 0.008, 1, 8]} />
            <meshBasicMaterial color={LAYER_COLOR[plane ?? "wall"]} />
          </mesh>
          <mesh ref={(m) => void (traceRef.current.left = m)} visible={false}>
            <cylinderGeometry args={[0.008, 0.008, 1, 8]} />
            <meshBasicMaterial color={LAYER_COLOR[plane ?? "wall"]} />
          </mesh>
        </>
      )}
    </>
  );
}
useGLTF.preload(AVATAR_URL);
useGLTF.preload(IDLE_URL);

// Signing space: half a metre deep (+Z), in front of the body plane.
function SigningSpaceBox({ dims }: { dims: Dims }) {
  const depth = 0.5;
  return (
    <mesh position={[0, dims.centerY, depth / 2]}>
      <boxGeometry args={[dims.width, dims.height, depth]} />
      <meshStandardMaterial color={LAYER_COLOR.box} transparent opacity={0.12} side={DoubleSide} />
      <Edges color={LAYER_COLOR.box} />
    </mesh>
  );
}

// Wall plane: vertical (parallel with the front wall), 2× the body extent.
function WallPlane({ dims }: { dims: Dims }) {
  return (
    <mesh position={[0, dims.centerY, 0]}>
      <planeGeometry args={[dims.width * 2, dims.height * 2]} />
      <meshStandardMaterial color={LAYER_COLOR.wall} transparent opacity={0.28} side={DoubleSide} />
      <Edges color={LAYER_COLOR.wall} />
    </mesh>
  );
}

// A small circle (radius 0.2 m) in the wall-plane orientation, drawn around the
// active hand's wrist: a faint transparent fill with a crisp red (wall-plane)
// edge. Avatar positions it at the wrist; it stays put as the arm gestures.
function WristCircle() {
  const R = 0.2;
  return (
    <>
      <mesh>
        <circleGeometry args={[R, 64]} />
        <meshBasicMaterial
          color={LAYER_COLOR.wall}
          transparent
          opacity={0.08}
          side={DoubleSide}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[R - 0.01, R, 64]} />
        <meshBasicMaterial color={LAYER_COLOR.wall} side={DoubleSide} />
      </mesh>
    </>
  );
}

// A bold 90° arc of the wrist circle, rotated (in Avatar) to the slice being
// traced and shown only during the gesture — it lights up the path the wrist
// follows. The base arc spans geometry-angle 0…90°; Avatar sets rotation.z.
function HighlightArc({ meshRef }: { meshRef: (m: Mesh | null) => void }) {
  const R = WRIST_CIRCLE_R;
  return (
    <mesh ref={meshRef} visible={false} position={[0, 0, 0.002]}>
      <ringGeometry args={[R - 0.03, R, 64, 1, 0, Math.PI / 2]} />
      <meshBasicMaterial color={LAYER_COLOR.wall} side={DoubleSide} />
    </mesh>
  );
}

// Floor plane: horizontal, 2× big, centred on the body at waist height.
function FloorPlane({ dims }: { dims: Dims }) {
  return (
    <mesh position={[0, dims.hipY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[dims.width * 2, 2]} />
      <meshStandardMaterial color={LAYER_COLOR.floor} transparent opacity={0.28} side={DoubleSide} />
      <Edges color={LAYER_COLOR.floor} />
    </mesh>
  );
}

// Diagonal plane: the Wall plane tilted 45° about the left-right (X) axis, so
// it lies halfway between the Wall and Floor planes. The up-diagonal rises
// up-and-forward (+Y, +Z) toward the front wall, the way the book draws it as a
// ramp; `down` mirrors the tilt to the perpendicular down-forward diagonal.
function DiagonalPlane({ dims, down = false }: { dims: Dims; down?: boolean }) {
  const tilt = down ? -Math.PI / 4 : Math.PI / 4;
  return (
    <mesh position={[0, dims.centerY, 0.5]} rotation={[tilt, 0, 0]}>
      <planeGeometry args={[dims.width * 2, dims.height * 2]} />
      <meshStandardMaterial
        color={LAYER_COLOR.diagonal}
        transparent
        opacity={0.28}
        side={DoubleSide}
      />
      <Edges color={LAYER_COLOR.diagonal} />
    </mesh>
  );
}

function CameraRig({
  controlsRef,
  view,
  targetY,
  hipY,
  locked = false,
}: {
  controlsRef: RefObject<ComponentRef<typeof CameraControls> | null>;
  view: View;
  targetY: number;
  hipY: number;
  locked?: boolean;
}) {
  const configured = useRef(false);
  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    const first = !configured.current;
    if (first) {
      configured.current = true;
      c.minDistance = 1.5;
      c.maxDistance = 6;
      c.minZoom = DEFAULT_ZOOM; // zoom locked
      c.maxZoom = DEFAULT_ZOOM;
      c.mouseButtons.wheel = CameraControlsImpl.ACTION.NONE;
      if (locked) {
        const none = CameraControlsImpl.ACTION.NONE;
        c.mouseButtons.left = none;
        c.mouseButtons.middle = none;
        c.mouseButtons.right = none;
        c.touches.one = none;
        c.touches.two = none;
        c.touches.three = none;
      }
      c.zoomTo(DEFAULT_ZOOM, false);
    }
    // Snap on the very first frame; animate on every later step change.
    if (view === "top") {
      // −Z eye offset rolls the view so forward (+Z) is up and the signer's
      // right (−X) is to the right of screen, matching the floor rose layout.
      c.setLookAt(0, hipY + 3.2, -0.001, 0, hipY, 0, !first);
    } else if (view === "front") {
      c.setLookAt(0, targetY, 3, 0, targetY, 0, !first);
    } else if (view === "back") {
      c.setLookAt(0, targetY, -3, 0, targetY, 0, !first);
    } else if (view === "side") {
      c.setLookAt(-3, targetY, 0, 0, targetY, 0, !first);
    } else {
      c.setLookAt(...VIEW_34, 0, targetY, 0, !first);
    }
  }, [controlsRef, view, targetY, hipY, locked]);
  return null;
}

function SignScene({
  layer,
  view,
  locked = false,
  square = false,
  arm,
  xray,
  side,
  plane,
  frame,
  circle,
  motion,
  overlay,
}: {
  layer: Layer;
  view: View;
  locked?: boolean;
  square?: boolean;
  arm?: { gesture: Gesture | null };
  xray?: boolean;
  side?: Side;
  plane?: Plane;
  frame?: "red" | "green";
  circle?: boolean;
  motion?: "reach" | "curve" | "over" | "under";
  overlay?: ReactNode;
}) {
  const [measure, setMeasure] = useState<Measure | null>(null);
  const controls = useRef<ComponentRef<typeof CameraControls>>(null);
  const dims = measure ? dimsFromMeasure(measure) : null;
  const targetY = measure ? measure.neckY : FALLBACK_TARGET_Y;
  const hipY = measure ? measure.hipY : FALLBACK_TARGET_Y;

  const canvasClass = [
    "scene3d__canvas",
    square && "scene3d__canvas--square",
    frame && `scene3d__canvas--frame-${frame}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="scene3d">
      <div className={canvasClass}>
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [2.4, 1.8, 2.6], fov: 45 }}
        >
          <ambientLight intensity={0.8} />
          <hemisphereLight args={["#ffffff", "#d4d4d8", 0.7]} />
          <directionalLight
            position={[0, 3.5, 4]}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={15}
            shadow-camera-left={-2}
            shadow-camera-right={2}
            shadow-camera-top={3}
            shadow-camera-bottom={-1}
          />
          <directionalLight position={[-3, 2.5, 3]} intensity={0.5} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial transparent opacity={0.3} />
          </mesh>
          <CameraControls ref={controls} />
          <CameraRig
            controlsRef={controls}
            view={view}
            targetY={targetY}
            hipY={hipY}
            locked={locked}
          />
          <Suspense fallback={null}>
            <Avatar
              onMeasure={setMeasure}
              arm={arm}
              xray={xray}
              side={side}
              plane={plane}
              circle={circle}
              motion={motion}
            />
          </Suspense>
          {layer === "box" && dims && <SigningSpaceBox dims={dims} />}
          {layer === "wall" && dims && <WallPlane dims={dims} />}
          {layer === "floor" && dims && <FloorPlane dims={dims} />}
          {layer === "diagonal" && dims && <DiagonalPlane dims={dims} />}
          {layer === "diagonal-down" && dims && <DiagonalPlane dims={dims} down />}
          <Grid
            args={[8, 8]}
            cellColor="#cbd5e1"
            sectionColor="#94a3b8"
            position={[0, 0, 0]}
            fadeDistance={14}
          />
        </Canvas>
        {overlay}
      </div>
    </div>
  );
}

const STEPS: { layer: Layer; view: View; title: string; body: ReactNode }[] = [
  {
    layer: "box",
    view: "34",
    title: "Signing Space",
    body: (
      <>
        <p>
          Signing space is the area in which you move while you sign. It is the
          distance you can reach in front, below and above you. Signing space
          travels with you wherever you go.
        </p>
        <p>
          Think of your signing space like a room. It has a front and back wall
          and a floor and ceiling. It is divided into planes. A plane is an
          imaginary flat surface that dissects your signing space.
        </p>
      </>
    ),
  },
  {
    layer: "wall",
    view: "34",
    title: "Wall Plane",
    body: (
      <>
        <p>
          The Wall Plane cuts the body like a door, from side to side. Movement
          parallel with the Wall Plane is up and down. It is written with
          double-stemmed arrows.
        </p>
        <div className="signspace-step__figs">
          <img src={asset("/figures/ch6/ch6-planes-wall-room.png")} alt="Wall Plane room" />
          <img
            src={asset("/figures/ch6/ch6-planes-wall-room-arrows.png")}
            alt="Wall Plane — double-stemmed arrows"
          />
        </div>
      </>
    ),
  },
  {
    layer: "floor",
    view: "34",
    title: "Floor Plane",
    body: (
      <>
        <p>
          The Floor Plane cuts the body like a tabletop, from front to back.
          Movement parallel with the Floor Plane is forward and back. It is
          written with single-stemmed arrows.
        </p>
        <div className="signspace-step__figs">
          <img src={asset("/figures/ch6/ch6-planes-floor-room.png")} alt="Floor Plane room" />
          <img
            src={asset("/figures/ch6/ch6-planes-floor-room-arrows.png")}
            alt="Floor Plane — single-stemmed arrows"
          />
        </div>
      </>
    ),
  },
];

// Rose ring radius as a fraction of the (square) scene size, so the buttons
// scale with the canvas instead of forming an oversized circle on small screens.
const ROSE_RADIUS_FACTOR = 0.3;
const ROSE_RADIUS_FALLBACK_PX = 225;

// Arrowhead variants are laid out by hand: right-hand is the base glyph, the
// left-hand one sits 0x10 above it, and the both-hands one 0x20 above.
function handSymbol(symbol: string, side: Side): string {
  const cp = symbol.codePointAt(0) ?? 0;
  if (side === "left") return String.fromCodePoint(cp + 0x10);
  if (side === "both") return String.fromCodePoint(cp + 0x20);
  return symbol;
}

function RoseOverlay({
  items,
  active,
  side,
  onSelect,
}: {
  items: { symbol: string; angle: number; label?: string }[];
  active: number | null;
  side: Side;
  onSelect: (angle: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(ROSE_RADIUS_FALLBACK_PX);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const size = Math.min(el.clientWidth, el.clientHeight);
      if (size > 0) setRadius(size * ROSE_RADIUS_FACTOR);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="scene3d__rose" ref={ref} data-no-print>
      {items.map(({ symbol, angle, label }) => {
        const rad = (angle * Math.PI) / 180;
        const dx = radius * Math.cos(rad);
        const dy = -radius * Math.sin(rad);
        const isActive = active === angle;
        return (
          <button
            type="button"
            key={symbol}
            className={
              isActive ? "scene3d__rose-item scene3d__rose-item--active" : "scene3d__rose-item"
            }
            style={{ transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)` }}
            onClick={() => onSelect(angle)}
          >
            <span className="scene3d__rose-badge">
              <sgnw-symbol symbol={handSymbol(symbol, side)}></sgnw-symbol>
            </span>
            {label && <span className="scene3d__rose-label">{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: "front" | "back";
  onChange: (view: "front" | "back") => void;
}) {
  return (
    <div className="scene3d__toggle scene3d__toggle--left" data-no-print>
      <button
        type="button"
        className={view === "front" ? "is-on" : undefined}
        onClick={() => onChange("front")}
      >
        Front
      </button>
      <button
        type="button"
        className={view === "back" ? "is-on" : undefined}
        onClick={() => onChange("back")}
      >
        Back
      </button>
    </div>
  );
}

function OverUnderToggle({
  mode,
  onChange,
}: {
  mode: "over" | "under";
  onChange: (mode: "over" | "under") => void;
}) {
  return (
    <div className="scene3d__toggle scene3d__toggle--left" data-no-print>
      <button type="button" className={mode === "over" ? "is-on" : undefined} onClick={() => onChange("over")}>
        Over
      </button>
      <button type="button" className={mode === "under" ? "is-on" : undefined} onClick={() => onChange("under")}>
        Under
      </button>
    </div>
  );
}

function HandToggle({ side, onChange }: { side: Side; onChange: (side: Side) => void }) {
  return (
    <div className="scene3d__toggle scene3d__toggle--right" data-no-print>
      <button
        type="button"
        className={side === "right" ? "is-on" : undefined}
        onClick={() => onChange("right")}
      >
        Right
      </button>
      <button
        type="button"
        className={side === "left" ? "is-on" : undefined}
        onClick={() => onChange("left")}
      >
        Left
      </button>
      <button
        type="button"
        className={side === "both" ? "is-on" : undefined}
        onClick={() => onChange("both")}
      >
        Both
      </button>
    </div>
  );
}

function useArmGesture() {
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [side, setSide] = useState<Side>("right");
  const nextId = useRef(0);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  const trigger = (angle: number) => {
    nextId.current += 1;
    setGesture({ angle, id: nextId.current });
    setActive(angle);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setActive(null), GESTURE_TOTAL * 1000);
  };

  return { gesture, active, side, setSide, trigger };
}

export function WallPlaneArrows3D() {
  const { gesture, active, side, setSide, trigger } = useArmGesture();
  const [view, setView] = useState<"front" | "back">("front");

  return (
    <SignScene
      layer="none"
      view={view}
      locked
      square
      frame="red"
      plane="wall"
      arm={{ gesture }}
      xray={view === "back"}
      side={side}
      overlay={
        <>
          <ViewToggle view={view} onChange={setView} />
          <HandToggle side={side} onChange={setSide} />
          <RoseOverlay items={WALL_ROSE} active={active} side={side} onSelect={trigger} />
        </>
      }
    />
  );
}

export function WallPlaneCurves3D() {
  const { gesture, active, side, setSide, trigger } = useArmGesture();
  const [view, setView] = useState<"front" | "back">("front");

  return (
    <SignScene
      layer="none"
      view={view}
      locked
      square
      frame="red"
      plane="wall"
      circle
      motion="curve"
      arm={{ gesture }}
      xray={view === "back"}
      side={side}
      overlay={
        <>
          <ViewToggle view={view} onChange={setView} />
          <HandToggle side={side} onChange={setSide} />
          <RoseOverlay items={WALL_CURVE_ROSE} active={active} side={side} onSelect={trigger} />
        </>
      }
    />
  );
}

export function ForwardBackOverCurves3D() {
  const { gesture, active, side, trigger } = useArmGesture();
  const [mode, setMode] = useState<"over" | "under">("over");

  return (
    <SignScene
      layer="none"
      view="side"
      square
      frame="green"
      plane="floor"
      motion={mode}
      arm={{ gesture }}
      side={side}
      overlay={
        <>
          <OverUnderToggle mode={mode} onChange={setMode} />
          <RoseOverlay
            items={mode === "over" ? OVER_ROSE : UNDER_ROSE}
            active={active}
            side={side}
            onSelect={trigger}
          />
        </>
      }
    />
  );
}

export function FloorPlaneArrows3D() {
  const { gesture, active, side, setSide, trigger } = useArmGesture();

  return (
    <SignScene
      layer="none"
      view="top"
      locked
      square
      frame="green"
      plane="floor"
      arm={{ gesture }}
      side={side}
      overlay={
        <>
          <HandToggle side={side} onChange={setSide} />
          <RoseOverlay items={FLOOR_ROSE} active={active} side={side} onSelect={trigger} />
        </>
      }
    />
  );
}

export function DiagonalPlane3D() {
  return <SignScene layer="diagonal" view="34" />;
}

export function DiagonalPlaneDown3D() {
  return <SignScene layer="diagonal-down" view="34" />;
}

export function SignSpaceSections() {
  return (
    <>
      {STEPS.map((step) => (
        <section className="signspace-section" key={step.layer}>
          <div className="signspace-section__text">
            <h2 style={{ color: LAYER_COLOR[step.layer] }}>{step.title}</h2>
            {step.body}
          </div>
          <div className="signspace-section__viewer">
            <SignScene layer={step.layer} view={step.view} />
          </div>
        </section>
      ))}
    </>
  );
}
