import { SgnwSign } from "./Sgnw";
import examples from "../content/handshape-examples.generated.json";

type Example = { word: string; swu: string; video: string };

const SETS: Record<string, Example[]> = examples;

export type HandshapeExamplesProps = {
  /** Which section's example set to render. */
  set: "toFace" | "toUp";
};

export function HandshapeExamples({ set }: HandshapeExamplesProps) {
  return (
    <ul className="handshape-examples">
      {SETS[set]?.map((example) => (
        <li key={`${example.word}-${example.swu}`}>
          <figcaption>{example.word}</figcaption>
          <SgnwSign sign={example.swu} video={example.video} size={36} />
        </li>
      ))}
    </ul>
  );
}
