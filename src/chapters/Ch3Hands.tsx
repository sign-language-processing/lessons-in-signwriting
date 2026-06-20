import { Trans, useTranslation } from "react-i18next";
import { ActionFingersTree } from "../components/ActionFingersTree";
import { Figure } from "../components/Figure";
import { FingerDirectionGrid } from "../components/FingerDirectionGrid";
import { Fingerspelling } from "../components/Fingerspelling";
import { HandGroupsExplorer } from "../components/HandGroupsExplorer";
import { HandshapeExamples } from "../components/HandshapeExamples";
import { HandshapeExplorer } from "../components/HandshapeExplorer";
import { HeelViewTable } from "../components/HeelView";
import { Grid } from "../components/Layout";
import { usePractice } from "../components/PracticeContext";
import { RootShapePractice } from "../components/RootShapePractice";
import { SgnwSign, SgnwSymbol } from "../components/Sgnw";
import { asset } from "../lib/asset";
import { YouTubeVideo } from "../components/YouTubeVideo";
import { TRANSCRIPT_2, VIDEO_CREDITS } from "../content/videos";

const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

const CAT_IN_HAT_VP =
  "𝠃𝥩𝤘񆿄𝤪𝣙񌏁𝣴𝣵񃇲𝤮𝣃񀂁𝥊𝢤񁻒𝤒𝣙񋦦𝥕𝢝 𝠃𝤢𝥉񌖡𝣴𝣴񂱑𝤒𝤹񂱙𝣬𝤹񈙁𝤒𝤗񈙑𝣬𝤗񎁑𝣴𝣴 񏌁𝣢𝤂 𝠃𝥞𝤗񌕁𝣴𝣴񁻒𝤖𝣣񃇲𝥃𝢿񇀨𝤫𝣕 𝠃𝤼𝤳񌕁𝣴𝣴񁶑𝤢𝣽񁶙𝣐𝣼񇆥𝤢𝤥񇆵𝣏𝤥 𝠃𝤶𝥑񌕁𝣴𝣴񎁑𝣴𝣴񁻱𝤞𝤂񁻹𝣗𝤂񃈗𝤡𝤸񃈟𝣚𝤸񇆥𝤝𝤦񇆵𝣑𝤧 𝠃𝤣𝥢񀁒𝤅𝤬񀁚𝣨𝤻񆕁𝤁𝥄񆿅𝤁𝥓񌕁𝣴𝣴񎁑𝣴𝣴 𝠃𝤲𝥢񎁑𝣴𝣴񌕁𝣴𝣴񃨁𝤐𝤟񃨉𝣤𝤟񉴽𝣟𝤺񉴥𝤛𝤺 񏊡𝣡𝤂 𝠃𝤻𝥆񌏁𝣴𝣴񍘡𝣴𝣴񎂡𝣴𝣴񁳀𝣑𝤗񆿕𝣠𝤷񎥁𝣯𝤓񆿅𝤠𝤵񁲸𝤠𝤗 𝠃𝤞𝥘񀠺𝣯𝤿񎁁𝣴𝣴񆿅𝤇𝤩񀠲𝤃𝤽񌓡𝣴𝣴 𝠃𝤲𝥘񎁁𝣴𝣴񌓡𝣴𝣴񂤩𝣹𝥄񃈳𝤅𝤩񆊱𝤐𝥁 𝠃𝤯𝥘񂇒𝤇𝤤񂇚𝣯𝤤񌓡𝣴𝣴񇕥𝤛𝤹񇕽𝣠𝤺 񏊡𝣡𝤂 𝠃𝤾𝥓񌖡𝣴𝣴񍪡𝣴𝣴񎲬𝤕𝤼񂇸𝤧𝤫񎴇𝣗𝥌񂈗𝣺𝥇񉖣𝣩𝤟 𝠃𝤤𝥐񌕁𝣴𝣴񍤡𝣴𝣴񆄱𝤕𝤢񆄹𝣩𝤢񈟃𝤖𝤵񈟗𝣫𝤴 𝠃𝤶𝥑񌕁𝣴𝣴񍤡𝣴𝣴񁻱𝤞𝤂񁻹𝣗𝤂񃈗𝤡𝤸񃈟𝣚𝤸񇆥𝤝𝤦񇆵𝣑𝤧 񏌁𝣢𝤂";

function CatInHatCredits() {
  return (
    <p>
      <Trans
        i18nKey="ch3.catInHatCredits"
        components={{
          em: <em />,
          sp: (
            <a href="http://www.signbank.org/SignPuddle1.6/canvas.php?ui=1&amp;sgn=5&amp;sid=144" />
          ),
        }}
      />
    </p>
  );
}

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
  const { t } = useTranslation();
  return (
    <table className="thumb-writing-table">
      <thead>
        <tr>
          <th>{t("ch3.thumbDot")}</th>
          <th>{t("ch3.thumbHand")}</th>
          <th>{t("ch3.thumbLine")}</th>
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
  toFace1:
    "image_000182_ad5e1796af3a7820d859f10328311845cb935f4461e13431cd1be6861199f8e0.png",
  toUp1:
    "image_000184_ec8ed23df6470eb477ee1e9b639f8f24bbd96c2df43ba2b3ec5b4ac8e4c68c8f.png",
};

export function Ch3Hands() {
  const { t } = useTranslation();
  const practice = usePractice();
  return (
    <>
      <h2 id="chapter-3">
        {t("common.chapterHeading", { number: 3, title: t("toc.chapter-3") })}
      </h2>
      <YouTubeVideo
        videoId="ttkMauu_I60"
        title={t("ch3.videoTitle")}
        credits={VIDEO_CREDITS}
        transcript={TRANSCRIPT_2}
      />
      <h2>{t("ch3.basicHeading")}</h2>

      <Grid columns="2fr 1fr 1fr" gap="0" justify="stretch">
        <div>
          <h2>{t("ch3.closedFist")}</h2>
          <p>{t("ch3.closedFistDesc")}</p>
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
          <h2>{t("ch3.openFist")}</h2>
          <p>{t("ch3.openFistDesc")}</p>
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
          <h2>{t("ch3.flatHand")}</h2>
          <p>{t("ch3.flatHandDesc")}</p>
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

      <h2>{t("ch3.usageHeading")}</h2>

      <Grid columns="1fr 1fr" gap="1.5em" align="center">
        <div>
          <h3>{t("ch3.closedFist")}</h3>
          <p>{t("ch3.usageClosed")}</p>
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
          <h3>{t("ch3.openFist")}</h3>
          <p>{t("ch3.usageOpen")}</p>
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

      <h2>{t("ch3.rootshapesHeading")}</h2>
      <p>{t("ch3.rootshapesIntro")}</p>
      <Grid columns="auto 1fr" gap="0.75em 1em" align="center" justify="start">
        <SgnwSymbol symbol="񆄡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsTight" />
        </p>

        <SgnwSymbol symbol="񂱁" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsCircle" />
        </p>

        <SgnwSymbol symbol="񂲡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsOval" />
        </p>

        <SgnwSymbol symbol="񂯡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsCurlicue" />
        </p>

        <SgnwSymbol symbol="񂣡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsCup" />
        </p>

        <SgnwSymbol symbol="񂻡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsHinge" />
        </p>

        <SgnwSymbol symbol="񃇡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsAngle" />
        </p>

        <SgnwSymbol symbol="񁪡" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsFlatThumb" />
        </p>

        <SgnwSymbol symbol="񂇁" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsFlat" />
        </p>

        <SgnwSymbol symbol="񂊑" style={{ justifySelf: "center" }} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="ch3.rsFlatHeel" />
        </p>
      </Grid>

      <RootShapePractice />

      <h2>{t("ch3.actionFingersHeading")}</h2>
      <p>{t("ch3.actionFingersIntro")}</p>
      <ActionFingersTree />

      <h2>{t("ch3.addingHeading")}</h2>
      <p>{t("ch3.addingIntro")}</p>
      <Grid columns="1fr 1fr 1fr" gap="1em" align="end">
        <strong>{t("ch3.colRootshape")}</strong>
        <strong>{t("ch3.col1Finger")}</strong>
        <strong>{t("ch3.colMoreFingers")}</strong>

        <SymbolCell symbol="񆄡" caption={t("ch3.closedFist")} />
        <SymbolCell symbol="񀀁" caption={t("ch3.cap1Closed")} />
        <SymbolCell symbol="񀕁" caption={t("ch3.cap2Closed")} />

        <SymbolCell symbol="񂱁" caption={t("ch3.openFist")} />
        <SymbolCell symbol="񀁡" caption={t("ch3.cap1Open")} />
        <SymbolCell symbol="񀖡" caption={t("ch3.cap2Open")} />

        <SymbolCell symbol="񂇁" caption={t("ch3.flatHand")} />
        <SymbolCell symbol="񂋡" caption={t("ch3.capThumbFlat")} />
        <SymbolCell symbol="񁲁" caption={t("ch3.cap5Flat")} />
      </Grid>

      <h2>{t("ch3.expFrontHeading")}</h2>
      <p>{t("ch3.expFrontIntro")}</p>
      <Grid columns="1fr 2fr" gap="1.5em" align="center">
        <Figure src={IMG.expFront1} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>
            <SgnwSymbol symbol="񂇁" /> {t("ch3.palmOfHand")}
          </h3>
          <p>{t("ch3.frontPalm1")}</p>
          <p>
            <Trans i18nKey="ch3.frontPalm2" />
          </p>
        </div>

        <Figure src={IMG.expFront2} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>
            <SgnwSymbol symbol="񂇑" /> {t("ch3.sideOfHand")}
          </h3>
          <p>{t("ch3.frontSide1")}</p>
          <p>
            <Trans i18nKey="ch3.frontSide2" />
          </p>
        </div>

        <Figure src={IMG.expFront3} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>
            <SgnwSymbol symbol="񂇡" /> {t("ch3.backOfHand")}
          </h3>
          <p>{t("ch3.frontBack1")}</p>
          <p>
            <Trans i18nKey="ch3.frontBack2" />
          </p>
        </div>
      </Grid>

      <h2>{t("ch3.expTopHeading")}</h2>
      <p>{t("ch3.expTopIntro")}</p>
      <Grid columns="1fr 2fr" gap="1.5em" align="center">
        <Figure src={IMG.expTop1} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>
            <SgnwSymbol symbol="񂇱" /> {t("ch3.palmOfHand")}
          </h3>
          <p>
            <Trans i18nKey="ch3.topPalm" />
          </p>
        </div>

        <Figure src={IMG.expTop2} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>
            <SgnwSymbol symbol="񂈁" /> {t("ch3.sideOfHand")}
          </h3>
          <p>
            <Trans i18nKey="ch3.topSide" />
          </p>
        </div>

        <Figure src={IMG.expTop3} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>
            <SgnwSymbol symbol="񂈑" /> {t("ch3.backOfHand")}
          </h3>
          <p>
            <Trans i18nKey="ch3.topBack" />
          </p>
        </div>
      </Grid>

      <div className="practice-launch" data-no-print>
        <button
          type="button"
          className="practice-launch__button"
          onClick={() => practice.open()}
        >
          🤚 {t("ch3.practiceButton")}
        </button>
        <p className="practice-launch__hint">{t("ch3.practiceHint")}</p>
      </div>

      <h2>{t("ch3.centerHeading")}</h2>
      <p>{t("ch3.centerIntro")}</p>
      <Figure src={IMG.center} />

      <h2>{t("ch3.wallPlaneHeading")}</h2>
      <p>{t("ch3.wallPlaneIntro")}</p>
      <Figure src={IMG.wallPlane} />

      <h2>{t("ch3.floorPlaneHeading")}</h2>
      <p>{t("ch3.floorPlaneIntro")}</p>
      <Figure src={IMG.floorPlane} />

      <h2>{t("ch3.sidePointHeading")}</h2>
      <p>{t("ch3.sidePointIntro")}</p>
      <Grid columns="1fr 2fr" gap="1.5em" align="center">
        <Figure src={IMG.side1} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>{t("ch3.chooseFrontHeading")}</h3>
          <p>{t("ch3.chooseFront1")}</p>
          <p>
            <Trans i18nKey="ch3.chooseFront2" />
          </p>
        </div>

        <Figure src={IMG.side2} style={{ margin: 0 }} />
        <div>
          <h3 style={{ marginTop: 0 }}>{t("ch3.topCorrectHeading")}</h3>
          <p>{t("ch3.topCorrect1")}</p>
          <p>
            <Trans i18nKey="ch3.topCorrect2" />
          </p>
        </div>
      </Grid>

      <h2>{t("ch3.palmFacingHeading")}</h2>
      <p>{t("ch3.palmFacingIntro")}</p>
      <HandshapeExplorer />

      <h2>{t("ch3.tenGroupsHeading")}</h2>
      <p>{t("ch3.tenGroupsIntro")}</p>
      <HandGroupsExplorer />

      <details className="info-box">
        <summary>{t("ch3.thumbSummary")}</summary>
        <p>{t("ch3.thumbIntro")}</p>
        <ThumbWritingTable />
      </details>
      <h2>{t("ch3.fingerspellingHeading")}</h2>
      <p>{t("ch3.fingerspellingIntro")}</p>
      <Fingerspelling />

      <h2>{t("ch3.heelFlatHeading")}</h2>
      <p>{t("ch3.heelFlatIntro")}</p>
      <p>
        <Trans i18nKey="ch3.heelTwoWays" />
      </p>
      <HeelViewTable
        rows={[
          {
            photo: "person-176-a.png",
            altPhoto: "person-176-b.png",
            symbolL: "񂊕",
            symbolR: "񂈑",
          },
          { photo: "person-177.png", symbolL: "񂍕", symbolR: "񂌱" },
          {
            photo: "person-178-a.png",
            symbolL: "񁳵",
            symbolR: "񁳑",
          },
          {
            photo: "person-178-b.png",
            symbolL: "񁹵",
            symbolR: "񁹑",
          },
          {
            photo: "person-178-c.png",
            symbolL: "񁶵",
            symbolR: "񁶑",
          },
        ]}
      />

      <h2>{t("ch3.heelFistHeading")}</h2>
      <p>{t("ch3.heelFistIntro")}</p>
      <HeelViewTable
        rows={[
          { photo: "person-179.png", symbolL: "񆆕", symbolR: "񆅱" },
          { photo: "person-180.png", symbolL: "񅱕", symbolR: "񅰱" },
        ]}
      />

      <h2>{t("ch3.fingerDirHeading")}</h2>
      <p>{t("ch3.fingerDirIntro")}</p>
      <FingerDirectionGrid />

      <h2>{t("ch3.toFaceHeading")}</h2>
      <p>{t("ch3.toFaceIntro")}</p>
      <p>
        <Trans i18nKey="ch3.toFaceBold" />
      </p>
      <Figure src={IMG.toFace1} />
      <p>{t("ch3.someExamples")}</p>
      <HandshapeExamples set="toFace" />

      <h2>{t("ch3.toUpHeading")}</h2>
      <h3>{t("ch3.angleHeading")}</h3>
      <p>{t("ch3.angleIntro1")}</p>
      <p>{t("ch3.angleIntro2")}</p>
      <Figure src={IMG.toUp1} />
      <div className="catinhat">
        <YouTubeVideo
          videoId="HK8Xb6vmjBA"
          title={t("ch3.catInHatTitle")}
          credits={<CatInHatCredits />}
        />
        <div className="catinhat__vp">
          <sgnw-vp vp={CAT_IN_HAT_VP} colorize="true"></sgnw-vp>
        </div>
      </div>
      <p>{t("ch3.someExamples")}</p>
      <HandshapeExamples set="toUp" />

      <h2>{t("ch3.toOutHeading")}</h2>
      <p>{t("ch3.toOutIntro")}</p>
      <figure style={{ textAlign: "center" }}>
        <SgnwSign sign="𝠃𝥮𝤣񌏁𝣳𝣵񍝁𝣳𝣵񎣡𝣱𝤟񃀒𝤗𝤉񃀚𝣛𝤉񈗧𝤶𝤎񈗳𝣅𝤏񃀑𝢤𝤎񃀙𝥌𝤎񆲅𝥘𝤄񆲅𝢝𝤃" />
        <figcaption>
          <Trans
            i18nKey="ch3.fairyGodmother"
            components={{
              sw: (
                <a
                  href="https://signwriting.org/library/children/cinderella/cind10.html"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
            }}
          />
        </figcaption>
      </figure>
    </>
  );
}
