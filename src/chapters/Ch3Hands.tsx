import { ActionFingersTree } from "../components/ActionFingersTree";
import { Figure } from "../components/Figure";
import { Fingerspelling } from "../components/Fingerspelling";
import { HandGroupsExplorer } from "../components/HandGroupsExplorer";
import { HandshapeExamples } from "../components/HandshapeExamples";
import { HandshapeExplorer } from "../components/HandshapeExplorer";
import { HeelViewCard } from "../components/HeelView";
import { Grid } from "../components/Layout";
import { SgnwSign, SgnwSymbol } from "../components/Sgnw";
import { asset } from "../lib/asset";
import { YouTubeVideo } from "../components/YouTubeVideo";
import { TRANSCRIPT_2, VIDEO_CREDITS } from "../content/videos";

const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

const CAT_IN_HAT_VP =
  "𝠃𝥩𝤘񆿄𝤪𝣙񌏁𝣴𝣵񃇲𝤮𝣃񀂁𝥊𝢤񁻒𝤒𝣙񋦦𝥕𝢝 𝠃𝤢𝥉񌖡𝣴𝣴񂱑𝤒𝤹񂱙𝣬𝤹񈙁𝤒𝤗񈙑𝣬𝤗񎁑𝣴𝣴 񏌁𝣢𝤂 𝠃𝥞𝤗񌕁𝣴𝣴񁻒𝤖𝣣񃇲𝥃𝢿񇀨𝤫𝣕 𝠃𝤼𝤳񌕁𝣴𝣴񁶑𝤢𝣽񁶙𝣐𝣼񇆥𝤢𝤥񇆵𝣏𝤥 𝠃𝤶𝥑񌕁𝣴𝣴񎁑𝣴𝣴񁻱𝤞𝤂񁻹𝣗𝤂񃈗𝤡𝤸񃈟𝣚𝤸񇆥𝤝𝤦񇆵𝣑𝤧 𝠃𝤣𝥢񀁒𝤅𝤬񀁚𝣨𝤻񆕁𝤁𝥄񆿅𝤁𝥓񌕁𝣴𝣴񎁑𝣴𝣴 𝠃𝤲𝥢񎁑𝣴𝣴񌕁𝣴𝣴񃨁𝤐𝤟񃨉𝣤𝤟񉴽𝣟𝤺񉴥𝤛𝤺 񏊡𝣡𝤂 𝠃𝤻𝥆񌏁𝣴𝣴񍘡𝣴𝣴񎂡𝣴𝣴񁳀𝣑𝤗񆿕𝣠𝤷񎥁𝣯𝤓񆿅𝤠𝤵񁲸𝤠𝤗 𝠃𝤞𝥘񀠺𝣯𝤿񎁁𝣴𝣴񆿅𝤇𝤩񀠲𝤃𝤽񌓡𝣴𝣴 𝠃𝤲𝥘񎁁𝣴𝣴񌓡𝣴𝣴񂤩𝣹𝥄񃈳𝤅𝤩񆊱𝤐𝥁 𝠃𝤯𝥘񂇒𝤇𝤤񂇚𝣯𝤤񌓡𝣴𝣴񇕥𝤛𝤹񇕽𝣠𝤺 񏊡𝣡𝤂 𝠃𝤾𝥓񌖡𝣴𝣴񍪡𝣴𝣴񎲬𝤕𝤼񂇸𝤧𝤫񎴇𝣗𝥌񂈗𝣺𝥇񉖣𝣩𝤟 𝠃𝤤𝥐񌕁𝣴𝣴񍤡𝣴𝣴񆄱𝤕𝤢񆄹𝣩𝤢񈟃𝤖𝤵񈟗𝣫𝤴 𝠃𝤶𝥑񌕁𝣴𝣴񍤡𝣴𝣴񁻱𝤞𝤂񁻹𝣗𝤂񃈗𝤡𝤸񃈟𝣚𝤸񇆥𝤝𝤦񇆵𝣑𝤧 񏌁𝣢𝤂";

const CAT_IN_HAT_CREDITS = (
  <p>
    <em>The Cat in the Hat</em> in ASL, page 1. SignWriting transcription from{" "}
    <a href="http://www.signbank.org/SignPuddle1.6/canvas.php?ui=1&amp;sgn=5&amp;sid=144">
      SignPuddle
    </a>
    .
  </p>
);

type ThumbRow = {
  hand: string;
  dot: string;
  line: string | { image: string };
};

const THUMB_ROWS: ThumbRow[] = [
  { hand: "/hands/01-10/01-10-001/01-10-001-01-01.png", dot: "񅯡", line: "񅯡" },
  { hand: "/hands/01-10/01-10-001/01-10-001-01-02.png", dot: "񅯱", line: { image: "thumb_line_2.png" } },
  { hand: "/hands/01-10/01-10-001/01-10-001-01-03.png", dot: "񅰁", line: "񅰁" },
];

function ThumbWritingTable() {
  return (
    <table className="thumb-writing-table">
      <thead>
        <tr>
          <th>Dot (Official)</th>
          <th>Hand</th>
          <th>Line</th>
        </tr>
      </thead>
      <tbody>
        {THUMB_ROWS.map((row) => (
          <tr key={row.hand}>
            <td>
              <SgnwSymbol symbol={row.dot} size={56} />
            </td>
            <td>
              <img src={asset(row.hand)} alt="hand pose" />
            </td>
            <td>
              {typeof row.line === "string" ? (
                <SgnwSymbol symbol={row.line} size={56} />
              ) : (
                <img
                  src={`${ART}/${row.line.image}`}
                  alt="thumb symbol with line"
                  style={{ width: 45, height: "auto" }}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SymbolCell({ symbol, caption }: { symbol: string; caption: string }) {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption>{caption}</figcaption>
      <SgnwSymbol symbol={symbol} />
    </figure>
  );
}

const IMG = {
  closedFist:
    "image_000078_1e6269e098684a67d7a642e2a90844457f8f25909103a3389683082899a59853.png",
  openFist:
    "image_000079_735614923830a79c56e968d735bd3e8f3341b61cfb936b452dd734382c80ed62.png",
  flatHand:
    "image_000080_74ae1ac7d6eb32c7ee94f26bf4053e4599830738da157ad26acffa50e377950b.png",
  basic1:
    "image_000082_d1569054e0e4c33943baf8aa2f66ef7b2d8defa357533f8d5f14e0b2882187ee.png",
  basic2:
    "image_000083_0b71b8e7ec8e2a271997dd26937bed3c3fb7e610ef9b66cb44573674b14f512a.png",
  quadA:
    "image_000084_6d28877a83a5e92b1be957258b52356d9187ffa7eb73c67da23b5dc2e3c8cf92_a.png",
  quadB:
    "image_000084_6d28877a83a5e92b1be957258b52356d9187ffa7eb73c67da23b5dc2e3c8cf92_b.png",
  quadC:
    "image_000079_735614923830a79c56e968d735bd3e8f3341b61cfb936b452dd734382c80ed62.png",
  quadD:
    "image_000084_6d28877a83a5e92b1be957258b52356d9187ffa7eb73c67da23b5dc2e3c8cf92_d.png",
  nineA:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_a.png",
  nineB:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_b.png",
  nineC:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_c.png",
  nineD:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_d.png",
  nineE:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_e.png",
  nineF:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_f.png",
  nineG:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_g.png",
  nineH:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_h.png",
  nineI:
    "image_000085_c27e6ce4cfa91be09e3f248b161f35df3a5decdde9a8fd06cc18dedc138f86fb_i.png",
  closedAdd:
    "image_000087_a8af8671f4a51bffb85641b8d8be79461d2cffb6e9476d7a131050f14f36e487.png",
  openAdd:
    "image_000090_4db19e0df5484c0bb939b31cf4a20e90c53540c570e413136102a1c4f8402bed.png",
  flatAdd:
    "image_000093_c69f0a4b5537323e3c111deea68a9b324fcf604a5d75163d41fcfc8141156c40.png",
  flatAdd1:
    "image_000094_b83115fca2c82df213a974d7be9e1825242bb299034366711140af5e5edc8ad1.png",
  actionFingers2:
    "image_000098_862f17312ef28ef7a5e2275f9277bfff7b604a76b79516d1caf224c0620fdbec.png",
  // Index Hand — Front View (page 39 split from image_000098)
  indexFrontSym1: "page_index_front_r1_symbol.png",
  indexFrontPhoto1: "page_index_front_r1_photo.png",
  indexFrontSym2: "page_index_front_r2_symbol.png",
  indexFrontPhoto2: "page_index_front_r2_photo.png",
  indexFrontSym3: "page_index_front_r3_symbol.png",
  indexFrontPhoto3: "page_index_front_r3_photo.png",
  // Index Hand — Top View (page 40 split from image_000099)
  indexTopSym1: "page_index_top_r1_symbol.png",
  indexTopPhoto1: "page_index_top_r1_photo.png",
  indexTopSym2: "page_index_top_r2_symbol.png",
  indexTopPhoto2: "page_index_top_r2_photo.png",
  indexTopSym3: "page_index_top_r3_symbol.png",
  indexTopPhoto3: "page_index_top_r3_photo.png",
  // Closed Fist — Front View (split from image_000100)
  closedFistFrontSym1: "page_closed_fist_front_r1_symbol.png",
  closedFistFrontPhoto1: "page_closed_fist_front_r1_photo.png",
  closedFistFrontSym2: "page_closed_fist_front_r2_symbol.png",
  closedFistFrontPhoto2: "page_closed_fist_front_r2_photo.png",
  closedFistFrontSym3: "page_closed_fist_front_r3_symbol.png",
  closedFistFrontPhoto3: "page_closed_fist_front_r3_photo.png",
  // Closed Fist — Top View (split from image_000101)
  closedFistTopSym1: "page_closed_fist_top_r1_symbol.png",
  closedFistTopPhoto1: "page_closed_fist_top_r1_photo.png",
  closedFistTopSym2: "page_closed_fist_top_r2_symbol.png",
  closedFistTopPhoto2: "page_closed_fist_top_r2_photo.png",
  closedFistTopSym3: "page_closed_fist_top_r3_symbol.png",
  closedFistTopPhoto3: "page_closed_fist_top_r3_photo.png",
  // Open Fist + Index (D-Hand) — Front View (split from image_000102)
  openIndexFrontSym1: "page_open_index_front_r1_symbol.png",
  openIndexFrontPhoto1: "page_open_index_front_r1_photo.png",
  openIndexFrontSym2: "page_open_index_front_r2_symbol.png",
  openIndexFrontPhoto2: "page_open_index_front_r2_photo.png",
  openIndexFrontSym3: "page_open_index_front_r3_symbol.png",
  openIndexFrontPhoto3: "page_open_index_front_r3_photo.png",
  // Open Fist + Index (D-Hand) — Top View (split from image_000103)
  openIndexTopSym1: "page_open_index_top_r1_symbol.png",
  openIndexTopPhoto1: "page_open_index_top_r1_photo.png",
  openIndexTopSym2: "page_open_index_top_r2_symbol.png",
  openIndexTopPhoto2: "page_open_index_top_r2_photo.png",
  openIndexTopSym3: "page_open_index_top_r3_symbol.png",
  openIndexTopPhoto3: "page_open_index_top_r3_photo.png",
  palmFront1:
    "image_000104_6c1a1bc8beb21c7d865bcc0efb90a41b2517e3581d49d3d88129c749c6e4fab2.png",
  palmFrontHalf: "page_042_open_fist_side.png",
  palmFront2:
    "image_000105_bff47255d65e34c84f3922e02ab68059c637c8a48f762c0ce0db7c4f5912b737.png",
  palmFront3:
    "image_000106_248a79acc2c7a50b27d5f7ce14cabc426ae536c8795206416c35256e12ee3210.png",
  palmFront4:
    "image_000107_0c06861530e4302ea4ca0c7988c975719561193a8c46569990ca8909a6e2b5eb.png",
  palmFront5:
    "image_000108_8ca632426902a7dfda53dad01b748defaf779305d26905632d9286dacbd7994d.png",
  palmTopB1:
    "image_000109_e1e91b5f6e27e537b2e85a14616d33b476c4cd254ecf7806a9e096900bcb2212.png",
  palmFrontB1:
    "image_000110_47a8440f7074f550d80eb4c899db219511c309a63488f4cea0c8efb1b49da1de.png",
  palmFrontB2:
    "image_000111_a85f0423427013d4f6c8c5680069f69271f12dfad87ce34b6dc8af94f76969a0.png",
  palmFrontB3:
    "image_000112_14a072071da00aee1c288de58847e7e1315f712174042dfd8f16e93f91b5d701.png",
  palmFrontB4:
    "image_000113_5692d96a37b0919f4c111ed5ab43063c2d0c03cfb9aa4138b7ff79da3c5e6f1c.png",
  palmFrontB5:
    "image_000114_160bbde34ccc6251bb7d9bd252b122e99df665677f8081984835487313a5c54b.png",
  palmFrontB6:
    "image_000115_ec946a4fc80a80f03afd07c55a2a852bde66593b1118cf6454d72914d27d7824.png",
  palmFrontB7:
    "image_000116_c6cafa3b08defbb5d0d629afdcc19b89d33a53863156b7f92624fb72bcde9774.png",
  palmFrontC1:
    "image_000117_23cbe7c2476a9b771831014d43edffba4adfa732a40a420fdf5026623169fdfa.png",
  palmFrontC2:
    "image_000118_8c302f455ca02a538cfd22e098f6c8a45b7cba3285dcd0527b0d6869d112f3e9.png",
  palmFrontC3:
    "image_000119_7e154dd2909f0d6db0565d0835fe134f82bc442c1f949442ab2e3e5526fed21a.png",
  palmFrontC4:
    "image_000120_9484a4d3ced72795fa4ede63ef4a37378a3bfbd1caecc48bf5a2b2076671a331.png",
  palmFrontC5:
    "image_000121_f63c3b2e012598f02f465ea93e1c3380d1c1ec926f4a48aac560cefda9c8cbb4.png",
  palmFrontC6:
    "image_000122_b17bbb946e4fc796e26b1230e39659a8cd369dc2d436ef99b15416a0ffa38655.png",
  palmFrontC7:
    "image_000123_399c563c41270b328b77a68ffbbecbc99c3a166f21bf29bfcd51d084531baab3.png",
  expFront1:
    "image_000124_5f2e55f5a09c24277395111e5b71035983a4cc1fedcd87080076642104af0dc0.png",
  expFront2:
    "image_000125_2b449e38f0ead362cd6f209c1069b7b82189c310f3bf638fb9bc208923d3030e.png",
  expFront3:
    "image_000126_b9d231526ac4f4643e3af270cdff480b78ae6871014e8a15c4e8fbdf227f219b.png",
  expTop1:
    "image_000127_b2de9e36fb11bdf012458447deca939d21f4f47723562d5a17cd5e449f8ef099.png",
  expTop2:
    "image_000128_b4c8ca4b1497d66fa29e79f652e78ec2debfbfdcc3dd783b77870de4a5707f9e.png",
  expTop3:
    "image_000129_6f551d3c65a3c6b8754d8be1a2e455d6e2fa4466bf5a634c50f037199993f080.png",
  center:
    "image_000130_3609b71eb55ac1196f1b19109944c907beb81c558d950f7cef80fdc512232d02_cropped.png",
  wallPlane:
    "image_000131_344b8f56f49dd01f66fa7465fa1baa9408ebddfb77508c7640dd8aaa1dde1703.png",
  floorPlane:
    "image_000132_083ff096ab602de180a021253b1696f90ab207f4d7fff1ecf2c3d2f23ff31683.png",
  side1:
    "image_000133_dc11db088482b6cc031077c62c49a51a8f71c4317559311ed2cccb52b0021d78.png",
  side2:
    "image_000134_0d58b1b1b663256a6eb78a7b9ae74e229df686025c620ce72b4445a09fc7b5a1.png",
  groups:
    "image_000135_d005ad2d2375c065829e0c15b415ca86569eed8b400f12c36df0868c51853469.png",
  groupsList:
    "image_000136_8f5d03b7b86438ab462e7b5e54610dca2c2634448a3fb6e9750598ea1734cb07.png",
  g1a:
    "image_000137_328ebd58a3800d52bfea32167566296be46cf1d280529a0d1eae6a04af9d52f8.png",
  g1b:
    "image_000138_00141e4f5a4826f0ea6d55e0e5f9c9f741b3852e1db42ac77665a904a29feea8.png",
  g1c:
    "image_000139_3dcdb94eaa6dcd9b7ac2bc2041fd081c529cb98accb7134acf2e3af2d3c8713d.png",
  g2a:
    "image_000140_0ebcd19b29316128972d32c34eda550d28bd3b5a8d983bd3e1466840b48e7a73.png",
  g2b:
    "image_000141_5dc6e2584b8ed444cb69cfa6d80375bc15f79cbdb7fe9bf5997e7d276efc9338.png",
  g3a:
    "image_000142_567248b287d08ef5bd5f589aecbee4f1b276ce34cb1cb9b8cf7bf2ed9b5d8f8b.png",
  g3b:
    "image_000143_2d898458c95c27b4485fd24564ac44aed51004b5d336fe2417138cfcd96f64b8.png",
  g3c:
    "image_000144_22b54e9a8a83808b519189d23940608a8b3602e86ad7671732a2a9c299580139.png",
  g3d:
    "image_000145_fe68b8a76afe68f1e3bf7fceb38b25f7a71ee832e886a506892a64ad1c1c7204.png",
  g4a:
    "image_000146_611041dc88375c7ae12e288445dbe3a258fde6568354a4c3f1ca1f9ef8341a42.png",
  g4b:
    "image_000147_3505e0c197f0ba87b34afa4048b849703c19366c86065111173af2efb599a9db.png",
  g5a:
    "image_000148_b5842e2dfddadc9bc38a5f001e2d391120ff65384bc394289097d09d89a705a2.png",
  g5b:
    "image_000149_b94f952908d019c34e3238ef005dffe28315498c6c61ad2ed3216aef1a480058.png",
  g5c:
    "image_000150_236336e8263f461e550d6f3ca374c57006c3acb5830c6565b3adf7d212b6abd0.png",
  g5d:
    "image_000151_ab2334dc73958b2131343949fe443b76de2361ae95f5f02c3e6acd573f0bf115.png",
  g5Front:
    "image_000152_f709bac504c7baed94b0a7ed2c17d74cb0e0b423525e60f5a0a5b78e0cb5bf46.png",
  g5Top:
    "image_000153_bbdcf9ea64f2b7878a80fdc297de5a87ebd2e30757aceb716c5434fbfb2626b8.png",
  g6a:
    "image_000154_1a615f37fbcf4506fe6d5f3c3f32cddf130f17982b9dcf8d4f624976e30b266f.png",
  g6b:
    "image_000155_fb378362effa6e9f9c15d021f1c6b012950d67f061ea4c5e997fcaa8becea37f.png",
  g6c:
    "image_000156_49436a68462de85c482e658e92446e8a2b08ae1fff113fd4bbe59ec31dac62d6.png",
  g6d:
    "image_000157_63c8ed773f9672ae5e0f2c59a2bbdd0dc2f0dd59fa5261291f8037789b573bfd.png",
  g6e:
    "image_000158_dab2b39fae9d24991abcfe49d2b35ef5692d2b8bf4eaadf28a2b4c2d9aa9705c.png",
  g6f:
    "image_000159_b9566246de39cfa745da8928410eec4b7e47f28a6e8d29c31e094dc012d046c5.png",
  g7a:
    "image_000160_8b735446ca4b2c255081be0fa385f4d49ebbc5e0753559dc7320e899e8fdde87.png",
  g7b:
    "image_000161_3b56e669f2bece28ed16daddde5e1cd7c4b8d68120e992d6409ac1e41ad50ab1.png",
  g7c:
    "image_000162_3607a012d6918160e601f186205d576bef837b495c5cc0407671a73d2f5f247d.png",
  g7d:
    "image_000163_e9e6ee090036fa5b07d4106365a463adc4bfa5106d1b380e458b231107a49fc6.png",
  g8a:
    "image_000164_0c55b63c6f21156254c7eee59d30417d786b4908aeeaa52e10a338a91e006591.png",
  g8b:
    "image_000165_c63451f72c8f3fef0a39848839f03450896ed9e60a21bca16eb3153a5e0a73d2.png",
  g8c:
    "image_000166_a157b0bfceb92e57cf738876d360ade06b444fad3050557e1d616e4d535e34a4.png",
  g9a:
    "image_000167_86e75d4112c4b0525b3f1041d980e0ca26c272ed0fccea6bc92247f95a1f089c.png",
  g9b:
    "image_000168_99f28ba065eae259ee4ea4eca5c875c3a3eb0943d62d2236d27f394a323c903f.png",
  g9c:
    "image_000169_8ba4114a00676db520edb104e54d462e93dd2a0acfeab9de33ef3bca987830c6.png",
  g9Front:
    "image_000170_d1d5573de4d41dcaea0c4d444b1e7c80c3ba68890496c47ca91889c6c0112b49.png",
  g9Top:
    "image_000171_3cf6cd4b59b325cee2a93a73ccc85267d41fb598c19a8c7738f74504a17f5a31.png",
  g10a:
    "image_000172_f6b7953dae3a264b7b4fbebf68c04abe6bb173016b700cb1a94edfeec0282ff3.png",
  g10b:
    "image_000173_964c3a222ef85657f2c8ff0d1736f60a2cc9cc42b2f50e8ad52bd20c60ca4e37.png",
  slant:
    "image_000181_59c56b1861aee5a64fb8d6cf4d12135084ac127dc45de66b28ba9939f2fba636.png",
  toFace1:
    "image_000182_ad5e1796af3a7820d859f10328311845cb935f4461e13431cd1be6861199f8e0.png",
  toUp1:
    "image_000184_ec8ed23df6470eb477ee1e9b639f8f24bbd96c2df43ba2b3ec5b4ac8e4c68c8f.png",
};

export function Ch3Hands() {
  return (
    <>
      <h2 id="chapter-3">Chapter 3 — Hands</h2>
      <YouTubeVideo
        videoId="ttkMauu_I60"
        title="Video 2 — SignWriting Basics"
        credits={VIDEO_CREDITS}
        transcript={TRANSCRIPT_2}
      />
      <h2>3 Basic Handshapes</h2>

      <Grid columns="2fr 1fr 1fr" gap="0" justify="stretch">
        <div>
          <h2>Closed Fist</h2>
          <p>
            When the fingertips touch the palm of the hand, it is called a
            Closed Fist. A Closed Fist is written with a square.
          </p>
        </div>
        <figure style={{ margin: 0 }}>
          <SgnwSymbol symbol="񆄡" />
        </figure>
        <Figure
          src={IMG.closedFist}
          style={{ margin: 0 }}
          imgStyle={{ maxHeight: 100 }}
        />

        <div>
          <h2>Open Fist</h2>
          <p>
            When the fingertips touch each other, it is called an Open Fist. An
            Open Fist is written with a circle.
          </p>
        </div>
        <figure style={{ margin: 0 }}>
          <SgnwSymbol symbol="񂱁" />
        </figure>
        <Figure
          src={IMG.openFist}
          style={{ margin: 0 }}
          imgStyle={{ maxHeight: 100 }}
        />

        <div>
          <h2>Flat Hand</h2>
          <p>
            When the fingers stretch straight up, and touch each other, it is
            called a Flat Hand. A Flat Hand is written with a rectangle, with a
            tip for the fingertips.
          </p>
        </div>
        <figure style={{ margin: 0 }}>
          <SgnwSymbol symbol="񂇁" />
        </figure>
        <Figure
          src={IMG.flatHand}
          style={{ margin: 0 }}
          imgStyle={{ maxHeight: 100 }}
        />
      </Grid>

      <h2>Usage in ASL</h2>

      <Grid columns="1fr 1fr" gap="1.5em" align="center">
        <div>
          <h3>Closed Fist</h3>
          <p>
            Both the letter S and the number 1 in ASL are written with a square
            for the Closed Fist, since the fingertips touch the palm.
          </p>
        </div>
        <Grid columns="1fr 1fr" gap="0.5em" align="end">
          <SgnwSymbol symbol="񆄡" />
          <SgnwSymbol symbol="񀀁" />
          <Figure
            src={IMG.closedFist}
            style={{ margin: 0 }}
            imgStyle={{ width: 80, height: "auto" }}
          />
          <Figure
            src={IMG.basic2}
            style={{ margin: 0 }}
            imgStyle={{ width: 80, height: "auto" }}
          />
        </Grid>
      </Grid>

      <Grid columns="1fr 1fr" gap="1.5em" align="center">
        <div>
          <h3>Open Fist</h3>
          <p>
            Both the letter O and the letter D in ASL are written with a circle
            for the Open Fist, since the fingertips touch each other.
          </p>
        </div>
        <Grid columns="1fr 1fr" gap="0.5em" align="end">
          <SgnwSymbol symbol="񂱁" />
          <SgnwSymbol symbol="񀁡" />
          <Figure
            src={IMG.openFist}
            style={{ margin: 0 }}
            imgStyle={{ width: 80, height: "auto" }}
          />
          <Figure
            src={IMG.quadD}
            style={{ margin: 0 }}
            imgStyle={{ width: 80, height: "auto" }}
          />
        </Grid>
      </Grid>

      <h2>Rootshapes</h2>
      <p>
        Like roots to a tree, Rootshapes provide the foundation for all hand
        symbols. Rootshapes are determined by the shape of the LOWEST finger in
        the handshape. For example, a square for a TIGHT Fist must have at
        least one finger touching the palm of the hand. A circle for an OPEN
        fist, has at least one finger close to the palm of the hand, but not
        touching the palm of the hand.
      </p>
      <Grid columns="auto 1fr" gap="0.75em 1em" align="center" justify="start">
        <SgnwSymbol symbol="񆄡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Tight Fist</strong> — at least 1 finger touches palm
        </p>

        <SgnwSymbol symbol="񂱁" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Circle</strong> — at least 1 fingertip touches thumbtip in a
          curve, or at least 1 curved finger is close to palm of hand
        </p>

        <SgnwSymbol symbol="񂣡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Cup</strong> — at least 1 finger is curved at the Middle
          Joint &amp; Tip Joint. There is NO bend or curve at the Knuckle
          Joint.
        </p>

        <SgnwSymbol symbol="񂻡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Hinge</strong> — at least 1 finger bends at the Knuckle
          Joint, while the Middle Joint and Tip Joint lock completely
          straight.
        </p>

        <SgnwSymbol symbol="񃇡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Angle</strong> — the Hinge, with fingertips and thumb tip
          touching
        </p>

        <SgnwSymbol symbol="񁪡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Flat Thumb Across</strong> — thumb across palm, four fingers
          straight up with no bends
        </p>

        <SgnwSymbol symbol="񂇁" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <strong>Flat</strong> — five fingers straight up with no bends
        </p>
      </Grid>

      <h2>Action Fingers</h2>
      <p>
        Once the Rootshape is established, the lines for the fingers are
        attached. The finger lines are called Action Fingers. They extend from
        the root of the hand like branches on a tree. Action Fingers are more
        important than the Rootshape, because they are looked at first, just as
        observers look at the branches of a tree first. Readers focus on Action
        Fingers first, since they give meaning to the handshape.
      </p>
      <ActionFingersTree />

      <h2>Adding Fingers</h2>
      <p>
        Start from the rootshape — a square for the Closed Fist, a circle for
        the Open Fist, a rectangle with a tip for the Flat Hand — and add one
        line for every finger that sticks up. One finger adds one line, two
        fingers add two lines, all five spread fingers add five lines.
      </p>
      <Grid columns="1fr 1fr 1fr" gap="1em" align="end">
        <strong>Rootshape</strong>
        <strong>1 Finger Up</strong>
        <strong>More Fingers Up</strong>

        <SymbolCell symbol="񆄡" caption="Closed Fist" />
        <SymbolCell symbol="񀀁" caption="1 finger up — Closed Fist" />
        <SymbolCell symbol="񀕁" caption="2 fingers up — Closed Fist" />

        <SymbolCell symbol="񂱁" caption="Open Fist" />
        <SymbolCell symbol="񀁡" caption="1 finger up — Open Fist" />
        <SymbolCell symbol="񀖡" caption="2 fingers up — Open Fist" />

        <SymbolCell symbol="񂇁" caption="Flat Hand" />
        <SymbolCell symbol="񂋡" caption="Thumb out — Flat Hand" />
        <SymbolCell symbol="񁲁" caption="5 fingers spread — Flat Hand" />
      </Grid>

      <h2>Expressive Front View</h2>
      <p>
        Signs are written from the signer's expressive viewpoint. Imagine
        standing BEHIND the signer, copying what the signer does and feels.
      </p>
      <Grid columns="1fr 2fr" gap="1.5em" align="center">
        <Figure src={IMG.expFront1} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Palm of Hand</h3>
          <p>The palm of the hand is written with a white or hollow symbol.</p>
          <p>
            <strong>Front View — Parallel with Wall Plane:</strong> the hand is
            parallel to the Front Wall. The white symbol shows that the palm
            faces towards your body, towards the reader.
          </p>
        </div>

        <Figure src={IMG.expFront2} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Side of Hand</h3>
          <p>
            The side of the hand is written with a symbol that is half-white
            and half-dark. The half-white section shows the direction of the
            palm. The half-dark section represents the back of the hand.
          </p>
          <p>
            <strong>Front View — Parallel with Wall Plane:</strong> the hand is
            parallel to the Front Wall. The thumb of the hand faces towards
            your body.
          </p>
        </div>

        <Figure src={IMG.expFront3} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Back of Hand</h3>
          <p>
            The back of the hand is written with a black or filled-in symbol.
          </p>
          <p>
            <strong>Front View — Parallel with Wall Plane:</strong> the hand is
            parallel to the Front Wall. The black symbol shows that the back of
            the hand faces towards your body.
          </p>
        </div>
      </Grid>

      <h2>Expressive Top View</h2>
      <p>
        Signs are written from the signer's expressive viewpoint. Imagine
        looking down on the position of the signer, from a bird's eye view.
      </p>
      <Grid columns="1fr 2fr" gap="1.5em" align="center">
        <Figure src={IMG.expTop1} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Palm of Hand</h3>
          <p>
            <strong>Top View — Parallel with Floor Plane:</strong> the hand is
            parallel to the floor. You are looking down at your palm from
            overhead. The white symbol has a space at the knuckle joint
            representing the Horizon Line. A hand symbol with the Horizon Line
            crossing over the knuckles means the hand is "parallel with the
            floor" read from the Top View.
          </p>
        </div>

        <Figure src={IMG.expTop2} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Side of Hand</h3>
          <p>
            <strong>Top View — Parallel with Floor Plane:</strong> the hand is
            parallel to the floor. You are looking down at the side of your
            hand (your thumb) from overhead. The hand symbol has a space at the
            knuckle joint representing the Horizon Line.
          </p>
        </div>

        <Figure src={IMG.expTop3} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Back of Hand</h3>
          <p>
            <strong>Top View — Parallel with Floor Plane:</strong> the hand is
            parallel to the floor. You are looking down at the back of your
            hand from overhead. The hand symbol has a space at the knuckle
            joint, representing the Horizon Line.
          </p>
        </div>
      </Grid>

      <h2>Hands Relate to Center</h2>
      <p>
        In the International SignWriting Alphabet, all hand symbols are
        designed to relate to the Center of the Body. Imagine a Center Line
        going down the center of your body. The Majority of Action Fingers are
        directed towards the center. Left hands are written to the left of the
        Center Line. Right hands are written to the right of the Center Line.
      </p>
      <Figure src={IMG.center} />

      <h2>The Wall Plane</h2>
      <p>
        Hand symbols parallel to the Front Wall look the same whether they are
        far from the chest, close to or touching the chest, or behind the body.
        You can FEEL the position of the palm facing. It remains the same
        symbol no matter how close or far it is.
      </p>
      <Figure src={IMG.wallPlane} />

      <h2>The Floor Plane</h2>
      <p>
        Hand symbols parallel to the Floor look the same whether they are high
        above the head, in the middle in front of your chest, or low at hip
        level. You can FEEL the position of the palm facing. It remains the
        same symbol no matter how high or low it is.
      </p>
      <Figure src={IMG.floorPlane} />

      <h2>Hands Pointing to the Side</h2>
      <p>
        Hand symbols with the fingers pointing to the side can be written from
        the Front View, parallel to the Front Wall Plane, or from the Top View,
        parallel to the Floor Plane. Both symbols are correct, since
        side-to-side can be seen from the Front View or the Top View. Choose to
        write the simpler symbols seen from the Front View, parallel to the
        Front Wall, since they are less complicated for quick reading:
      </p>
      <Grid columns="1fr 2fr" gap="1.5em" align="center">
        <Figure src={IMG.side1} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Choose the Front View</h3>
          <p>
            The Front View writes the palm of the hand with a white or hollow
            symbol.
          </p>
          <p>
            <strong>Front View Is Easier to Read:</strong> when the fingers
            point to the side wall, it is best to write the symbol parallel to
            the Front Wall because the symbol is easier to read.
          </p>
        </div>

        <Figure src={IMG.side2} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>Top View Is Correct but…</h3>
          <p>
            The Top View of the hand is written with a half-white half-dark
            symbol with the Horizon Line across the knuckles.
          </p>
          <p>
            <strong>Top View Is Harder to Read:</strong> when the fingers point
            to the side wall, it is correct to write the symbol parallel to the
            Floor, but it is harder to read and therefore not recommended.
          </p>
        </div>
      </Grid>

      <h2>Palm Facing: Examples</h2>
      <p>
        Pick a handshape and a plane (parallel with the front wall, or
        parallel with the floor) to see the three palm-facing variants — palm,
        side, and back — alongside the matching hand photos.
      </p>
      <HandshapeExplorer />

      <h2>10 Groups of Hands</h2>
      <p>
        There are ten groups of hand symbols in the International SignWriting
        Alphabet. The hands are grouped according to which fingers are used.
        These ten groups are the beginning of the Sign Symbol Sequence, the
        order of symbols used to look up signs in SignWriting dictionaries by
        Sign-Symbols. Handshapes used in all signed languages are included. All
        ten groups are listed on the following pages. An easy way to remember
        these groups is to count from one to ten in American Sign Language
        (ASL).
      </p>
      <HandGroupsExplorer />

      <details className="info-box">
        <summary>Two Ways to Write Thumb Towards Reader</summary>
        <p>
          The side view of the Thumb Hand can be written in two ways. The dot
          for the thumb projecting directly toward the reader is the official
          symbol of the ISWA 2010. But some writers choose to write a line for
          the thumb to the side, rather than the dot. The line for the thumb
          is always placed on the dark side of the symbol. Both methods mean
          the same thing and are correct.
        </p>
        <ThumbWritingTable />
      </details>
      <h2>Fingerspelling</h2>
      <p>
        Hand shapes, often by themselves, are used to represent letters in many
        sign languages, allowing signers to assemble words letter by letter.
      </p>
      <Fingerspelling />

      <h2>Heel of Hand or Top View?</h2>
      <p>
        Flat hands with the fingers pointing straight forward, with the arm
        parallel to the Floor Plane, can be written from a special viewpoint
        called the Heel of Hand "Wrist View", or from the traditional Top View.
      </p>
      <p>
        <strong>Two Ways to Write The Same Handshape</strong> — Heel of Hand
        Wrist View …OR… Top View. Use either symbol.
      </p>
      <HeelViewCard
        photo="person-176-a.png"
        altPhoto="person-176-b.png"
        symbolL="symbol-176-L.png"
        symbolR="symbol-176-R.png"
      />
      <HeelViewCard
        photo="person-177.png"
        symbolL="symbol-177-L.png"
        symbolR="symbol-177-R.png"
      />
      <HeelViewCard
        photo="person-178-a.png"
        symbolL="symbol-178-a-L.png"
        symbolR="symbol-178-a-R.png"
      />
      <HeelViewCard
        photo="person-178-b.png"
        symbolL="symbol-178-b-L.png"
        symbolR="symbol-178-b-R.png"
      />
      <HeelViewCard
        photo="person-178-c.png"
        symbolL="symbol-178-c-L.png"
        symbolR="symbol-178-c-R.png"
      />

      <h2>Heel of Hand or Top View?</h2>
      <p>
        Fists with the knuckles directed straight forward, with the arm
        parallel to the Floor Plane, can be written from a special viewpoint
        called the Heel of Hand "Wrist View", or from the traditional Top View.
      </p>
      <HeelViewCard
        photo="person-179.png"
        symbolL="symbol-179-L.png"
        symbolR="symbol-179-R.png"
      />
      <HeelViewCard
        photo="person-180.png"
        symbolL="symbol-180-L.png"
        symbolR="symbol-180-R.png"
      />

      <h2>Finger Direction Is Meaningful</h2>
      <p>
        Two ways to write the same position: the Top View of the Back of the
        Hand can be written at a slant. Some writers feel this looks more like
        real life, because the fingers are directed down. Both angles are
        correct.
      </p>
      <Figure src={IMG.slant} />

      <h2>Action Fingers Directed Towards The Face</h2>
      <p>
        Finger direction relates to the Center of the Body. Action Fingers that
        bend at the knuckle joint in Angle, Hinge, Cup or Curve hand positions
        direct the fingers into the Center of the Body. The white palm shows
        the palm is facing the body, with a slight hint that the palm is
        slightly turned toward the Center too.
      </p>
      <p>
        <strong>Fingers Are Directed Toward the Center</strong> — when the palm
        is facing the body.
      </p>
      <Figure src={IMG.toFace1} />
      <p>Some ASL signs as examples:</p>
      <HandshapeExamples set="toFace" />

      <h2>Action Fingers Directed Up</h2>
      <h3>Angle Hand Symbols</h3>
      <p>Point the tip of the angled fingers in meaningful directions.</p>
      <p>
        When writing Angle Hands, write the direction of the fingers based on
        what "feels correct" for the meaning of the sign. Then look at your
        palm. Where is the palm facing? If the palm is facing the ceiling, then
        it is parallel to the floor. It will be white with a space at the
        knuckle joint.
      </p>
      <Figure src={IMG.toUp1} />
      <div className="catinhat">
        <YouTubeVideo
          videoId="HK8Xb6vmjBA"
          title="The Cat in the Hat in ASL — page 1"
          credits={CAT_IN_HAT_CREDITS}
        />
        <div className="catinhat__vp">
          <sgnw-vp vp={CAT_IN_HAT_VP} colorize="true"></sgnw-vp>
        </div>
      </div>
      <p>Some ASL signs as examples:</p>
      <HandshapeExamples set="toUp" />

      <h2>Action Fingers Directed Out (Away From The Body)</h2>
      <p>
        This is very rare. If the majority of Action Fingers are directed to
        the outside, away from the Center of the Body, as in the sign for FAIRY
        GODMOTHER in ASL, then it is written pointing out.
      </p>
      <figure style={{ textAlign: "center" }}>
        <SgnwSign sign="𝠃𝥮𝤣񌏁𝣳𝣵񍝁𝣳𝣵񎣡𝣱𝤟񃀒𝤗𝤉񃀚𝣛𝤉񈗧𝤶𝤎񈗳𝣅𝤏񃀑𝢤𝤎񃀙𝥌𝤎񆲅𝥘𝤄񆲅𝢝𝤃" />
        <figcaption>
          Action fingers directed to the outside in the sign for "Fairy
          Godmother" —{" "}
          <a
            href="https://signwriting.org/library/children/cinderella/cind10.html"
            target="_blank"
            rel="noreferrer"
          >
            signwriting.org
          </a>
        </figcaption>
      </figure>
    </>
  );
}
