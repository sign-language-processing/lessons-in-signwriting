import { BASE_SYMBOL_NAMES } from "./baseSymbolNames";

export type HandBase = {
  index: number;
  base: string;
  symbol: string;
  name: string;
};

export type HandExample = {
  word: string;
  /** Cropped textbook image (sign glyph + word). Legacy presentation. */
  file?: string;
  /** Formal SignWriting string used to render a live <sgnw-sign>. */
  sign?: string;
  /** Video URL — shown on hover when paired with a `sign`. */
  video?: string;
  /** Empty slot used to keep the 6-cell (one-per-fill) grid aligned when no
   *  sign with that fill exists in the source dataset. */
  placeholder?: boolean;
};

export type HandGroup = {
  number: number;
  name: string;
  symbol: string;
  bases: HandBase[];
  examples: HandExample[];
};

const GROUP_NAMES: Record<number, string> = {
  1: "Index Finger",
  2: "Index & Middle Fingers",
  3: "Index, Middle & Thumb",
  4: "Four Fingers",
  5: "Five Fingers",
  6: "Baby Finger",
  7: "Ring Finger",
  8: "Middle Finger",
  9: "Index & Thumb",
  10: "Thumb",
};

// 3-hex base codes for every base symbol in each of the 10 hand groups,
// following the ISWA 2010 Sign Symbol Sequence (S100 – S204).
const GROUP_BASES: Record<number, string[]> = {
  1: ["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "10a", "10b", "10c", "10d"],
  2: ["10e", "10f", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "11a", "11b", "11c", "11d"],
  3: ["11e", "11f", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "12a", "12b", "12c", "12d", "12e", "12f", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "13a", "13b", "13c", "13d", "13e", "13f", "140", "141", "142", "143"],
  4: ["144", "145", "146", "147", "148", "149", "14a", "14b"],
  5: ["14c", "14d", "14e", "14f", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "15a", "15b", "15c", "15d", "15e", "15f", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "16a", "16b", "16c", "16d", "16e", "16f", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "17a", "17b", "17c", "17d", "17e", "17f", "180", "181", "182", "183", "184", "185"],
  6: ["186", "187", "188", "189", "18a", "18b", "18c", "18d", "18e", "18f", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "19a", "19b", "19c", "19d", "19e", "19f", "1a0", "1a1", "1a2", "1a3", "1a4", "1a5", "1a6", "1a7", "1a8", "1a9", "1aa"],
  7: ["1ab", "1ac", "1ad", "1ae", "1af", "1b0", "1b1", "1b2", "1b3", "1b4", "1b5", "1b6", "1b7", "1b8", "1b9", "1ba", "1bb", "1bc", "1bd", "1be", "1bf", "1c0", "1c1", "1c2", "1c3"],
  8: ["1c4", "1c5", "1c6", "1c7", "1c8", "1c9", "1ca", "1cb", "1cc", "1cd", "1ce", "1cf", "1d0", "1d1", "1d2", "1d3", "1d4", "1d5", "1d6", "1d7", "1d8", "1d9", "1da"],
  9: ["1db", "1dc", "1dd", "1de", "1df", "1e0", "1e1", "1e2", "1e3", "1e4", "1e5", "1e6", "1e7", "1e8", "1e9", "1ea", "1eb", "1ec", "1ed", "1ee", "1ef", "1f0", "1f1", "1f2", "1f3", "1f4"],
  10: ["1f5", "1f6", "1f7", "1f8", "1f9", "1fa", "1fb", "1fc", "1fd", "1fe", "1ff", "200", "201", "202", "203", "204"],
};

// Pre-computed SWU character for each base symbol. For seven bases whose
// default orientation (fill 0 / rotation 0) is missing from
// SuttonSignWritingOneD, the first present orientation is used.
const BASE_SYMBOLS: Record<string, string> = {
  "100": "񀀁", "101": "񀁡", "102": "񀃁", "103": "񀄡", "104": "񀆁", "105": "񀇡", "106": "񀉁", "107": "񀊡", "108": "񀌁", "109": "񀍡",
  "10a": "񀏁", "10b": "񀐡", "10c": "񀒁", "10d": "񀓡", "10e": "񀕁", "10f": "񀖡", "110": "񀘁", "111": "񀙡", "112": "񀛁", "113": "񀜡",
  "114": "񀞁", "115": "񀟡", "116": "񀡁", "117": "񀢡", "118": "񀤁", "119": "񀥡", "11a": "񀧁", "11b": "񀨡", "11c": "񀪁", "11d": "񀫡",
  "11e": "񀭁", "11f": "񀮡", "120": "񀰁", "121": "񀱡", "122": "񀳁", "123": "񀴡", "124": "񀶁", "125": "񀷡", "126": "񀹁", "127": "񀺡",
  "128": "񀼁", "129": "񀽡", "12a": "񀿁", "12b": "񁀡", "12c": "񁂁", "12d": "񁃡", "12e": "񁅁", "12f": "񁆡", "130": "񁈁", "131": "񁉡",
  "132": "񁋁", "133": "񁌡", "134": "񁎁", "135": "񁏡", "136": "񁑁", "137": "񁒡", "138": "񁔁", "139": "񁕡", "13a": "񁗁", "13b": "񁘡",
  "13c": "񁚁", "13d": "񁛡", "13e": "񁝁", "13f": "񁞡", "140": "񁠁", "141": "񁡡", "142": "񁣁", "143": "񁤡", "144": "񁦁", "145": "񁧡",
  "146": "񁩁", "147": "񁪡", "148": "񁬁", "149": "񁭡", "14a": "񁯁", "14b": "񁰡", "14c": "񁲁", "14d": "񁳱", "14e": "񁵁", "14f": "񁶱",
  "150": "񁸁", "151": "񁹱", "152": "񁻁", "153": "񁼡", "154": "񁾁", "155": "񁿡", "156": "񂁁", "157": "񂂡", "158": "񂄁", "159": "񂅡",
  "15a": "񂇁", "15b": "񂈡", "15c": "񂊑", "15d": "񂋡", "15e": "񂍑", "15f": "񂎡", "160": "񂐁", "161": "񂑡", "162": "񂓁", "163": "񂔡",
  "164": "񂖁", "165": "񂗡", "166": "񂙁", "167": "񂚡", "168": "񂜁", "169": "񂝡", "16a": "񂟁", "16b": "񂠡", "16c": "񂢁", "16d": "񂣡",
  "16e": "񂥁", "16f": "񂦡", "170": "񂨁", "171": "񂩡", "172": "񂫁", "173": "񂬡", "174": "񂮁", "175": "񂯡", "176": "񂱁", "177": "񂲡",
  "178": "񂴁", "179": "񂵡", "17a": "񂷁", "17b": "񂸡", "17c": "񂺁", "17d": "񂻡", "17e": "񂽁", "17f": "񂾡", "180": "񃀁", "181": "񃁡",
  "182": "񃃁", "183": "񃄡", "184": "񃆁", "185": "񃇡", "186": "񃉁", "187": "񃊡", "188": "񃌁", "189": "񃍡", "18a": "񃏁", "18b": "񃐡",
  "18c": "񃒁", "18d": "񃓡", "18e": "񃕁", "18f": "񃖡", "190": "񃘁", "191": "񃙡", "192": "񃛁", "193": "񃜡", "194": "񃞁", "195": "񃟡",
  "196": "񃡁", "197": "񃢡", "198": "񃤁", "199": "񃥡", "19a": "񃧁", "19b": "񃨡", "19c": "񃪁", "19d": "񃫡", "19e": "񃭁", "19f": "񃮡",
  "1a0": "񃰁", "1a1": "񃱡", "1a2": "񃳁", "1a3": "񃴡", "1a4": "񃶁", "1a5": "񃷡", "1a6": "񃹁", "1a7": "񃺡", "1a8": "񃼁", "1a9": "񃽡",
  "1aa": "񃿁", "1ab": "񄀡", "1ac": "񄂁", "1ad": "񄃡", "1ae": "񄅁", "1af": "񄆡", "1b0": "񄈁", "1b1": "񄉡", "1b2": "񄋁", "1b3": "񄌡",
  "1b4": "񄎁", "1b5": "񄏡", "1b6": "񄑁", "1b7": "񄒡", "1b8": "񄔁", "1b9": "񄕡", "1ba": "񄗁", "1bb": "񄘡", "1bc": "񄚁", "1bd": "񄛡",
  "1be": "񄝁", "1bf": "񄞡", "1c0": "񄠁", "1c1": "񄡡", "1c2": "񄣁", "1c3": "񄤡", "1c4": "񄦁", "1c5": "񄧡", "1c6": "񄩁", "1c7": "񄪡",
  "1c8": "񄬁", "1c9": "񄭡", "1ca": "񄯁", "1cb": "񄰡", "1cc": "񄲁", "1cd": "񄳡", "1ce": "񄵁", "1cf": "񄶡", "1d0": "񄸁", "1d1": "񄹡",
  "1d2": "񄻁", "1d3": "񄼡", "1d4": "񄾁", "1d5": "񄿡", "1d6": "񅁁", "1d7": "񅂡", "1d8": "񅄁", "1d9": "񅅡", "1da": "񅇁", "1db": "񅈡",
  "1dc": "񅊁", "1dd": "񅋡", "1de": "񅍁", "1df": "񅎡", "1e0": "񅐁", "1e1": "񅑡", "1e2": "񅓁", "1e3": "񅔡", "1e4": "񅖁", "1e5": "񅗡",
  "1e6": "񅙁", "1e7": "񅚡", "1e8": "񅜁", "1e9": "񅝡", "1ea": "񅟁", "1eb": "񅠡", "1ec": "񅢁", "1ed": "񅣡", "1ee": "񅥁", "1ef": "񅦡",
  "1f0": "񅨁", "1f1": "񅩡", "1f2": "񅫁", "1f3": "񅬡", "1f4": "񅮁", "1f5": "񅯡", "1f6": "񅱑", "1f7": "񅲡", "1f8": "񅴁", "1f9": "񅵡",
  "1fa": "񅷁", "1fb": "񅸡", "1fc": "񅺁", "1fd": "񅻡", "1fe": "񅽁", "1ff": "񅾡", "200": "񆀁", "201": "񆁡", "202": "񆃁", "203": "񆄡",
  "204": "񆆑",
};

// Six examples per group, one for each fill (0..5) of the group's hand
// symbol. Slot order matches fill order — group 8 has no fill-3 sign in the
// dataset, so a `placeholder` entry holds that grid slot empty.
const HAND_GROUP_EXAMPLES: Record<number, HandExample[]> = {
  1: [
    { word: "one-half", sign: "𝠃𝤎𝤮񀀁𝣿𝣞񆿅𝤀𝣿񀕁𝣿𝤐", video: "/videos/whatsthatsign/M508x540S10000493x460S22a04494x493S10e00493x510.mp4" },
    { word: "Deaf", sign: "𝠃𝤭𝤣񋾡𝣴𝣵񀀒𝤘𝤅񆇡𝤈𝤘", video: "/videos/whatsthatsign/M539x529S2ff00482x483S10011518x499S20500502x518.mp4" },
    { word: "where", sign: "𝠃𝤗𝤜񀀡𝣶𝣱񈩧𝤈𝣴", video: "/videos/whatsthatsign/M517x522S10020484x479S27106502x482.mp4" },
    { word: "happen", sign: "𝠃𝤢𝤣񀀱𝤏𝤅񀀹𝣯𝤅񉳁𝤋𝣪񉳙𝣫𝣪", video: "/videos/whatsthatsign/M528x529S10030509x499S10038477x499S2a200505x472S2a218473x472.mp4" },
    { word: "you", sign: "𝠃𝤎𝤝񀁁𝣿𝣿񈗡𝣿𝣯", video: "/videos/whatsthatsign/M508x523S10040493x493S26500493x477.mp4" },
    { word: "doctor", sign: "𝠃𝤠𝤛񂇺𝤉𝣱񀂲𝣭𝣻񆉁𝣽𝤐", video: "/videos/whatsthatsign/M526x521S15a39503x479S10151475x489S20600491x510.mp4" },
  ],
  2: [
    { word: "visit", sign: "𝠃𝤛𝤣񀕁𝤌𝤅񀕉𝣲𝣺񈗡𝤌𝣴񈗱𝣲𝣩", video: "/videos/whatsthatsign/M521x529S10e00506x499S10e08480x488S26500506x482S26510480x471.mp4" },
    { word: "haircut", sign: "𝠃𝤹𝤲񋾡𝣴𝣵񀕑𝤜𝣲񀕙𝣡𝤂񆺣𝤯𝣴񆺧𝣓𝤅񈟅𝤖𝤔񈟕𝣛𝤤񋻥𝣼𝤧", video: "/videos/whatsthatsign/M551x544S2ff00482x483S10e10522x480S10e18463x496S22702541x482S22706449x499S26a04516x514S26a14457x530S2fd04490x533.mp4" },
    { word: "trim", sign: "𝠃𝤮𝤙񀕡𝤍𝣻񀕩𝣞𝣻񆺷𝤀𝣴񆺳𝣰𝣴񈗧𝤟𝤋񈗷𝣰𝤋", video: "/videos/whatsthatsign/M540x519S10e20507x489S10e28460x489S22716494x482S22712478x482S26506525x505S26516478x505.mp4" },
    { word: "wiped out", sign: "𝠃𝤚𝤡񂇺𝣳𝤇񀕱𝣸𝣫񆕁𝤍𝤃񈗥𝤌𝤒", video: "/videos/whatsthatsign/M520x527S15a39481x501S10e30486x473S20e00507x497S26504506x512.mp4" },
    { word: "copy & paste", sign: "𝠃𝤿𝤪񀖁𝣨𝣣񀖉𝣎𝣣񋀅𝣼𝤂񀙁𝤌𝤏񀙉𝣱𝤏񀖁𝤰𝣣񀖉𝤕𝣣", video: "/videos/whatsthatsign/M557x536S10e40470x465S10e48444x465S2d524490x496S11040506x509S11048479x509S10e40542x465S10e48515x465.mp4" },
    { word: "crab", sign: "𝠃𝤧𝤕񀖑𝤘𝣷񀖙𝣦𝣷񆺷𝤋𝣷񆺳𝣸𝣷", video: "/videos/whatsthatsign/M533x515S10e50518x485S10e58468x485S22716505x485S22712486x485.mp4" },
  ],
  3: [
    { word: "3", sign: "𝠃𝤒𝤕񀭁𝣻𝣷", video: "/videos/whatsthatsign/M512x515S11e00489x485.mp4" },
    { word: "3 hours", sign: "𝠃𝤘𝤤񂇙𝣴𝣿񀭑𝤁𝣩񋚡𝤃𝤋", video: "/videos/whatsthatsign/M518x530S15a18482x493S11e10495x471S2e700497x505.mp4" },
    { word: "three years old", sign: "𝠃𝤫𝤱񋾡𝣴𝣵񀭡𝣽𝤓񊩂𝤘𝤒", video: "/videos/whatsthatsign/M537x543S2ff00482x483S11e20491x513S2c601518x512.mp4" },
    { word: "you three", sign: "𝠃𝤖𝤟񀭲𝣽𝤁񋟳𝣶𝣭", video: "/videos/whatsthatsign/M516x525S11e31491x495S2ea32484x475.mp4" },
    { word: "rocking chair", sign: "𝠃𝤭𝤠񀮁𝤖𝤂񀮉𝣟𝤂񇈁𝤓𝣬񇈑𝣠𝣬", video: "/videos/whatsthatsign/M539x526S11e40516x496S11e48461x496S23000513x474S23010462x474.mp4" },
    { word: "hike", sign: "𝠃𝤯𝤟񀮑𝤋𝣮񀮙𝣩𝣮񈩡𝤇𝤐񈩵𝣝𝤐", video: "/videos/whatsthatsign/M541x525S11e50505x476S11e58471x476S27100501x510S27114459x510.mp4" },
  ],
  4: [
    { word: "4", sign: "𝠃𝤑𝤖񁦁𝣻𝣷", video: "/videos/whatsthatsign/M511x516S14400489x485.mp4" },
    { word: "talk", sign: "𝠃𝤫𝤯񋾡𝣴𝣵񁦑𝣽𝤐񆉁𝤕𝤑", video: "/videos/whatsthatsign/M537x541S2ff00482x483S14410491x510S20600515x511.mp4" },
    { word: "curtains", sign: "𝠃𝤪𝤟񁦡𝤔𝣭񁦩𝣣𝣭񆿅𝤖𝤐񆿕𝣩𝤐", video: "/videos/whatsthatsign/M536x525S14420514x475S14428465x475S22a04516x510S22a14471x510.mp4" },
    { word: "several", sign: "𝠃𝤤𝤖񅳑𝣨𝤇񈗧𝣿𝤈񁦱𝤎𝣷", video: "/videos/whatsthatsign/M530x516S1f730470x501S26506493x502S14430508x485.mp4" },
    { word: "streaming", sign: "𝠃𝤭𝤥񁧁𝤗𝣨񁧉𝣬𝣳񇈄𝤆𝣿񇈔𝣟𝤌", video: "/videos/whatsthatsign/M539x531S14440517x470S14448474x481S23003500x493S23013461x506.mp4" },
    { word: "freeway", sign: "𝠃𝤦𝤩񁧑𝤉𝣶񁧝𝣸𝤊񆕁𝣿𝣪񈟁𝤋𝣣񈟕𝣧𝣱", video: "/videos/whatsthatsign/M532x535S14450503x484S1445c486x504S20e00493x472S26a00505x465S26a14469x479.mp4" },
  ],
  5: [
    { word: "fire", sign: "𝠃𝤰𝤧񁲁𝤑𝣵񁲉𝣦𝣵񆷱𝤒𝣦񆷱𝣦𝣦񇑁𝤉𝤖񇑕𝣝𝤖", video: "/videos/whatsthatsign/M542x533S14c00511x483S14c08468x483S22510512x468S22510468x468S23600503x516S23614459x516.mp4" },
    { word: "traffic", sign: "𝠃𝤲𝤥񁲑𝤄𝣻񁲙𝣲𝤆񆕁𝣿𝣯񈩡𝤊𝣧񈩵𝣚𝣵", video: "/videos/whatsthatsign/M544x531S14c10498x489S14c18480x500S20e00493x477S27100504x469S27114456x483.mp4" },
    { word: "deer", sign: "𝠃𝤯𝤘񋾡𝣴𝣵񁲡𝤕𝣪񁲩𝣠𝣪񆉁𝤙𝤋񆉁𝣝𝤋", video: "/videos/whatsthatsign/M541x518S2ff00482x483S14c20515x472S14c28462x472S20600519x505S20600459x505.mp4" },
    { word: "finish", sign: "𝠃𝤥𝤥񁲱𝤌𝣧񁲹𝣨𝣧񉳅𝤎𝤉񉳝𝣨𝤉", video: "/videos/whatsthatsign/M531x531S14c30506x469S14c38470x469S2a204508x503S2a21c470x503.mp4" },
    { word: "wind", sign: "𝠃𝤩𝤨񁳁𝤆𝣥񁳉𝣣𝣥񉶍𝤐𝤄񉶝𝣭𝤄", video: "/videos/whatsthatsign/M535x534S14c40500x467S14c48465x467S2a40c510x498S2a41c475x498.mp4" },
    { word: "calm", sign: "𝠃𝤦𝤟񁳑𝤎𝣮񁳙𝣧𝣮񆿅𝤔𝤐񆿕𝣬𝤐", video: "/videos/whatsthatsign/M532x525S14c50508x476S14c58469x476S22a04514x510S22a14474x510.mp4" },
  ],
  6: [
    { word: "now", sign: "𝠃𝤨𝤚񃧁𝤌𝣳񃧉𝣥𝣳񆿅𝤓𝤋񆿕𝣭𝤋", video: "/videos/whatsthatsign/M534x520S19a00506x481S19a08467x481S22a04513x505S22a14475x505.mp4" },
    { word: "interview", sign: "𝠃𝤯𝥆񋾡𝣴𝣵񃛑𝤉𝤚񃛙𝣮𝤢񈩡𝤇𝤯񈩵𝣝𝤷", video: "/videos/whatsthatsign/M541x564S2ff00482x483S19210503x520S19218476x528S27100501x541S27114459x549.mp4" },
    { word: "size", sign: "𝠃𝤣𝤔񃧡𝤇𝤀񃧩𝣩𝤀񆉁𝣻𝣸", video: "/videos/whatsthatsign/M529x514S19a20501x494S19a28471x494S20600489x486.mp4" },
    { word: "subway", sign: "𝠃𝤥𝤛񂇛𝣯𝣱񃧱𝣨𝣺񆙡𝤆𝤀񈩧𝤖𝣳", video: "/videos/whatsthatsign/M531x521S15a1a477x479S19a30470x488S21100500x494S27106516x481.mp4" },
    { word: "last", sign: "𝠃𝤞𝤣񃜊𝣯𝣩񃜁𝤉𝣭񆿅𝤐𝤔񆕁𝤐𝤃", video: "/videos/whatsthatsign/M524x529S19249477x471S19240503x475S22a04510x514S20e00510x497.mp4" },
    { word: "stay", sign: "𝠃𝤩𝤙񃨑𝤍𝣳񃨙𝣣𝣳񆿅𝤕𝤊񆿕𝣪𝤊", video: "/videos/whatsthatsign/M535x519S19a50507x481S19a58465x481S22a04515x504S22a14472x504.mp4" },
  ],
  7: [
    { word: "light", sign: "𝠃𝤤𝤫񋾡𝣴𝣵񄘡𝣹𝤏񆫡𝤒𝤟񆐡𝤕𝤐", video: "/videos/whatsthatsign/M530x537S2ff00482x483S1bb00487x509S21d00512x525S20b00515x510.mp4" },
    { word: "18", sign: "𝠃𝤜𝤚񄘱𝣰𝣾񋐉𝤇𝣲", video: "/videos/whatsthatsign/M522x520S1bb10478x492S2e008501x480.mp4" },
    { word: "volleyball", sign: "𝠃𝤥𝤚񄙁𝤐𝣾񄙉𝣧𝣾񆫡𝤏𝣳񆫡𝣪𝣳", video: "/videos/whatsthatsign/M531x520S1bb20510x492S1bb28469x492S21d00509x481S21d00472x481.mp4" },
    { word: "ghost", sign: "𝠃𝤜𝤣񄙛𝤀𝤎񄙲𝣰𝣼񆌁𝤋𝣿񆿁𝣻𝣪", video: "/videos/whatsthatsign/M522x529S1bb3a494x508S1bb51478x490S20800505x493S22a00489x472.mp4" },
    { word: "8th place", sign: "𝠃𝤑𝤢񄙡𝣼𝣫񈗥𝤂𝤋񋵡𝤃𝤝", video: "/videos/whatsthatsign/M511x528S1bb40490x473S26504496x505S2f900497x523.mp4" },
    { word: "88", sign: "𝠃𝤗𝤟񄙱𝣻𝣭񈙇𝣹𝤆񇆥𝣶𝤑", video: "/videos/whatsthatsign/M517x525S1bb50489x475S26606487x500S22f04484x511.mp4" },
  ],
  8: [
    { word: "sick", sign: "𝠃𝤫𝥅񋾡𝣴𝣵񄧡𝤍𝣮񄧪𝣯𝤠񆇡𝤃𝤺", video: "/videos/whatsthatsign/M537x563S2ff00482x483S1c500507x476S1c509477x526S20500497x552.mp4" },
    { word: "value", sign: "𝠃𝤝𝤜񄵑𝤇𝣱񄵙𝣰𝣱񆉁𝣻𝤑", video: "/videos/whatsthatsign/M523x522S1ce10501x479S1ce18478x479S20600489x511.mp4" },
    { word: "nothing", sign: "𝠃𝤥𝤫񄵡𝤏𝣡񄵩𝣧𝣡񈩣𝤑𝤃񈩷𝣭𝤃", video: "/videos/whatsthatsign/M531x537S1ce20509x463S1ce28469x463S27102511x497S27116475x497.mp4" },
    { word: "", placeholder: true },
    { word: "sew", sign: "𝠃𝤣𝤠񄶉𝣪𝣭񄶁𝤀𝣭񆕁𝣺𝤍񋗯𝤈𝤉", video: "/videos/whatsthatsign/M529x526S1ce48472x475S1ce40494x475S20e00488x507S2e50e502x503.mp4" },
    { word: "pepper", sign: "𝠃𝤚𝤠񄶑𝣿𝣭񇑅𝣳𝤏", video: "/videos/whatsthatsign/M520x526S1ce50493x475S23604481x509.mp4" },
  ],
  9: [
    { word: "Georgia", sign: "𝠃𝤕𝤗񅨁𝣸𝣵񅳁𝤁𝤈", video: "/videos/whatsthatsign/M515x517S1f000486x483S1f720495x502.mp4" },
    { word: "guard", sign: "𝠃𝤡𝤑񅨙𝤄𝣼񅨑𝣫𝤂", video: "/videos/whatsthatsign/M527x511S1f018498x490S1f010473x496.mp4" },
    { word: "group", sign: "𝠃𝤥𝤜񅨡𝤈𝤍񅨩𝣨𝤍񋎧𝤈𝣱񋎿𝣱𝣱", video: "/videos/whatsthatsign/M531x522S1f020502x507S1f028470x507S2df06502x479S2df1e479x479.mp4" },
    { word: "errands", sign: "𝠃𝤣𝤤񅮸𝤌𝣳񅯀𝣬𝣳񆱴𝤐𝣨񆱶𝣩𝣨񋟇𝤊𝤕񋟗𝣪𝤕", video: "/videos/whatsthatsign/M529x530S1f437506x481S1f43f474x481S22113510x470S22115471x470S2ea06504x515S2ea16472x515.mp4" },
    { word: "big", sign: "𝠃𝤪𝤟񅒡𝤒𝣭񅒩𝣤𝣭񉌆𝤖𝤋񉌞𝣣𝤋", video: "/videos/whatsthatsign/M536x525S1e140512x475S1e148466x475S28805516x505S2881d465x505.mp4" },
    { word: "language", sign: "𝠃𝤩𝤡񅋑𝤈𝣫񅋙𝣭𝣫񉌆𝤕𝤍񉌞𝣤𝤍", video: "/videos/whatsthatsign/M535x527S1dc50502x473S1dc58475x473S28805515x507S2881d466x507.mp4" },
  ],
  10: [
    { word: "game", sign: "𝠃𝤖𝤙񅯣𝤇𝣴񅯫𝣷𝣴񆉁𝣼𝤎", video: "/videos/whatsthatsign/M516x519S1f502501x482S1f50a485x482S20600490x508.mp4" },
    { word: "back", sign: "𝠃𝤭𝤢񋾡𝣴𝣵񅯱𝤞𝤁񈗥𝤟𝤓", video: "/videos/whatsthatsign/M539x528S2ff00482x483S1f510524x495S26504525x513.mp4" },
    { word: "mail", sign: "𝠃𝤟𝥜񍘡𝣴𝣵񅯣𝣾𝤐񆿆𝤄𝤫񅯫𝣿𝥄񅰁𝤇𝤻", video: "/videos/whatsthatsign/M525x586S33b00482x483S1f502492x510S22a05498x537S1f50a493x562S1f520501x553.mp4" },
    { word: "dresser", sign: "𝠃𝤨𝤢񆅑𝤙𝣫񆅙𝣥𝣫񆿥𝤀𝤉񈗥𝤚𝤁񈗥𝤚𝤓񈗵𝣥𝤁񈗵𝣥𝤓", video: "/videos/whatsthatsign/M534x528S20330519x473S20338467x473S22a24494x503S26504520x495S26504520x513S26514467x495S26514467x513.mp4" },
    { word: "pass", sign: "𝠃𝤖𝤣񅰡𝤇𝤋񅰩𝣷𝤀񆕁𝤉𝣻񈗡𝤈𝣩", video: "/videos/whatsthatsign/M516x529S1f540501x505S1f548485x494S20e00503x489S26500502x471.mp4" },
    { word: "area", sign: "𝠃𝤟𝤘񅰱𝤇𝣴񅰹𝣭𝣴񊿫𝤌𝤈񊿳𝣭𝤈", video: "/videos/whatsthatsign/M525x518S1f550501x482S1f558475x482S2d50a506x502S2d512475x502.mp4" },
  ],
};

function buildGroup(g: number): HandGroup {
  const bases = (GROUP_BASES[g] ?? []).map((base, i) => ({
    index: i + 1,
    base,
    symbol: BASE_SYMBOLS[base] ?? "",
    name: BASE_SYMBOL_NAMES[base] ?? `BaseSymbol ${base}`,
  }));
  return {
    number: g,
    name: GROUP_NAMES[g] ?? `Group ${g}`,
    symbol: bases[0]?.symbol ?? "",
    bases,
    examples: HAND_GROUP_EXAMPLES[g] ?? [],
  };
}

export const HAND_GROUPS: HandGroup[] = Array.from({ length: 10 }, (_, i) =>
  buildGroup(i + 1),
);
