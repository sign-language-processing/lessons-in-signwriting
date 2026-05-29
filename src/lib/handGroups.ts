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
    { word: "one-half", sign: "𝠃𝤎𝤮񀀁𝣿𝣞񆿅𝤀𝣿񀕁𝣿𝤐", video: "/videos/whatsthatsign/one-half/one-half.mp4" },
    { word: "Deaf", sign: "𝠃𝤭𝤣񋾡𝣴𝣵񀀒𝤘𝤅񆇡𝤈𝤘", video: "/videos/whatsthatsign/deaf/deaf.mp4" },
    { word: "where", sign: "𝠃𝤗𝤜񀀡𝣶𝣱񈩧𝤈𝣴", video: "/videos/whatsthatsign/where/where.mp4" },
    { word: "happen", sign: "𝠃𝤢𝤣񀀱𝤏𝤅񀀹𝣯𝤅񉳁𝤋𝣪񉳙𝣫𝣪", video: "/videos/whatsthatsign/happen/happen.mp4" },
    { word: "you", sign: "𝠃𝤎𝤝񀁁𝣿𝣿񈗡𝣿𝣯", video: "/videos/whatsthatsign/you/you.mp4" },
    { word: "doctor", sign: "𝠃𝤠𝤛񂇺𝤉𝣱񀂲𝣭𝣻񆉁𝣽𝤐", video: "/videos/whatsthatsign/doctor/doctor.mp4" },
  ],
  2: [
    { word: "visit", sign: "𝠃𝤛𝤣񀕁𝤌𝤅񀕉𝣲𝣺񈗡𝤌𝣴񈗱𝣲𝣩", video: "/videos/whatsthatsign/visit/visit.mp4" },
    { word: "haircut", sign: "𝠃𝤹𝤲񋾡𝣴𝣵񀕑𝤜𝣲񀕙𝣡𝤂񆺣𝤯𝣴񆺧𝣓𝤅񈟅𝤖𝤔񈟕𝣛𝤤񋻥𝣼𝤧", video: "/videos/whatsthatsign/haircut/haircut.mp4" },
    { word: "trim", sign: "𝠃𝤮𝤙񀕡𝤍𝣻񀕩𝣞𝣻񆺷𝤀𝣴񆺳𝣰𝣴񈗧𝤟𝤋񈗷𝣰𝤋", video: "/videos/whatsthatsign/trim/trim.mp4" },
    { word: "wiped out", sign: "𝠃𝤚𝤡񂇺𝣳𝤇񀕱𝣸𝣫񆕁𝤍𝤃񈗥𝤌𝤒", video: "/videos/whatsthatsign/wiped-out/wiped-out.mp4" },
    { word: "copy & paste", sign: "𝠃𝤿𝤪񀖁𝣨𝣣񀖉𝣎𝣣񋀅𝣼𝤂񀙁𝤌𝤏񀙉𝣱𝤏񀖁𝤰𝣣񀖉𝤕𝣣", video: "/videos/whatsthatsign/copy-paste/copy-paste.mp4" },
    { word: "crab", sign: "𝠃𝤧𝤕񀖑𝤘𝣷񀖙𝣦𝣷񆺷𝤋𝣷񆺳𝣸𝣷", video: "/videos/whatsthatsign/crab/crab.mp4" },
  ],
  3: [
    { word: "3", sign: "𝠃𝤒𝤕񀭁𝣻𝣷", video: "/videos/whatsthatsign/3/3.mp4" },
    { word: "3 hours", sign: "𝠃𝤘𝤤񂇙𝣴𝣿񀭑𝤁𝣩񋚡𝤃𝤋", video: "/videos/whatsthatsign/3-hours/3-hours.mp4" },
    { word: "three years old", sign: "𝠃𝤫𝤱񋾡𝣴𝣵񀭡𝣽𝤓񊩂𝤘𝤒", video: "/videos/whatsthatsign/three-years-old/three-years-old.mp4" },
    { word: "you three", sign: "𝠃𝤖𝤟񀭲𝣽𝤁񋟳𝣶𝣭", video: "/videos/whatsthatsign/you-three/you-three.mp4" },
    { word: "rocking chair", sign: "𝠃𝤭𝤠񀮁𝤖𝤂񀮉𝣟𝤂񇈁𝤓𝣬񇈑𝣠𝣬", video: "/videos/whatsthatsign/rocking-chair/rocking-chair.mp4" },
    { word: "hike", sign: "𝠃𝤯𝤟񀮑𝤋𝣮񀮙𝣩𝣮񈩡𝤇𝤐񈩵𝣝𝤐", video: "/videos/whatsthatsign/hike/hike.mp4" },
  ],
  4: [
    { word: "4", sign: "𝠃𝤑𝤖񁦁𝣻𝣷", video: "/videos/whatsthatsign/4/4.mp4" },
    { word: "talk", sign: "𝠃𝤫𝤯񋾡𝣴𝣵񁦑𝣽𝤐񆉁𝤕𝤑", video: "/videos/whatsthatsign/talk/talk.mp4" },
    { word: "curtains", sign: "𝠃𝤪𝤟񁦡𝤔𝣭񁦩𝣣𝣭񆿅𝤖𝤐񆿕𝣩𝤐", video: "/videos/whatsthatsign/curtains/curtains.mp4" },
    { word: "several", sign: "𝠃𝤤𝤖񅳑𝣨𝤇񈗧𝣿𝤈񁦱𝤎𝣷", video: "/videos/whatsthatsign/several/several.mp4" },
    { word: "streaming", sign: "𝠃𝤭𝤥񁧁𝤗𝣨񁧉𝣬𝣳񇈄𝤆𝣿񇈔𝣟𝤌", video: "/videos/whatsthatsign/streaming/streaming.mp4" },
    { word: "freeway", sign: "𝠃𝤦𝤩񁧑𝤉𝣶񁧝𝣸𝤊񆕁𝣿𝣪񈟁𝤋𝣣񈟕𝣧𝣱", video: "/videos/whatsthatsign/freeway/freeway.mp4" },
  ],
  5: [
    { word: "fire", sign: "𝠃𝤰𝤧񁲁𝤑𝣵񁲉𝣦𝣵񆷱𝤒𝣦񆷱𝣦𝣦񇑁𝤉𝤖񇑕𝣝𝤖", video: "/videos/whatsthatsign/fire/fire.mp4" },
    { word: "traffic", sign: "𝠃𝤲𝤥񁲑𝤄𝣻񁲙𝣲𝤆񆕁𝣿𝣯񈩡𝤊𝣧񈩵𝣚𝣵", video: "/videos/whatsthatsign/traffic/traffic.mp4" },
    { word: "deer", sign: "𝠃𝤯𝤘񋾡𝣴𝣵񁲡𝤕𝣪񁲩𝣠𝣪񆉁𝤙𝤋񆉁𝣝𝤋", video: "/videos/whatsthatsign/deer/deer.mp4" },
    { word: "finish", sign: "𝠃𝤥𝤥񁲱𝤌𝣧񁲹𝣨𝣧񉳅𝤎𝤉񉳝𝣨𝤉", video: "/videos/whatsthatsign/finish/finish.mp4" },
    { word: "wind", sign: "𝠃𝤩𝤨񁳁𝤆𝣥񁳉𝣣𝣥񉶍𝤐𝤄񉶝𝣭𝤄", video: "/videos/whatsthatsign/wind/wind.mp4" },
    { word: "calm", sign: "𝠃𝤦𝤟񁳑𝤎𝣮񁳙𝣧𝣮񆿅𝤔𝤐񆿕𝣬𝤐", video: "/videos/whatsthatsign/calm/calm.mp4" },
  ],
  6: [
    { word: "now", sign: "𝠃𝤨𝤚񃧁𝤌𝣳񃧉𝣥𝣳񆿅𝤓𝤋񆿕𝣭𝤋", video: "/videos/whatsthatsign/now/now.mp4" },
    { word: "interview", sign: "𝠃𝤯𝥆񋾡𝣴𝣵񃛑𝤉𝤚񃛙𝣮𝤢񈩡𝤇𝤯񈩵𝣝𝤷", video: "/videos/whatsthatsign/interview/interview.mp4" },
    { word: "size", sign: "𝠃𝤣𝤔񃧡𝤇𝤀񃧩𝣩𝤀񆉁𝣻𝣸", video: "/videos/whatsthatsign/size/size.mp4" },
    { word: "subway", sign: "𝠃𝤥𝤛񂇛𝣯𝣱񃧱𝣨𝣺񆙡𝤆𝤀񈩧𝤖𝣳", video: "/videos/whatsthatsign/subway/subway.mp4" },
    { word: "last", sign: "𝠃𝤞𝤣񃜊𝣯𝣩񃜁𝤉𝣭񆿅𝤐𝤔񆕁𝤐𝤃", video: "/videos/whatsthatsign/last/last.mp4" },
    { word: "stay", sign: "𝠃𝤩𝤙񃨑𝤍𝣳񃨙𝣣𝣳񆿅𝤕𝤊񆿕𝣪𝤊", video: "/videos/whatsthatsign/stay/stay.mp4" },
  ],
  7: [
    { word: "light", sign: "𝠃𝤤𝤫񋾡𝣴𝣵񄘡𝣹𝤏񆫡𝤒𝤟񆐡𝤕𝤐", video: "/videos/whatsthatsign/light/light.mp4" },
    { word: "18", sign: "𝠃𝤜𝤚񄘱𝣰𝣾񋐉𝤇𝣲", video: "/videos/whatsthatsign/18/18.mp4" },
    { word: "volleyball", sign: "𝠃𝤥𝤚񄙁𝤐𝣾񄙉𝣧𝣾񆫡𝤏𝣳񆫡𝣪𝣳", video: "/videos/whatsthatsign/volleyball/volleyball.mp4" },
    { word: "ghost", sign: "𝠃𝤜𝤣񄙛𝤀𝤎񄙲𝣰𝣼񆌁𝤋𝣿񆿁𝣻𝣪", video: "/videos/whatsthatsign/ghost/ghost.mp4" },
    { word: "8th place", sign: "𝠃𝤑𝤢񄙡𝣼𝣫񈗥𝤂𝤋񋵡𝤃𝤝", video: "/videos/whatsthatsign/8th-place/8th-place.mp4" },
    { word: "88", sign: "𝠃𝤗𝤟񄙱𝣻𝣭񈙇𝣹𝤆񇆥𝣶𝤑", video: "/videos/whatsthatsign/88/88.mp4" },
  ],
  8: [
    { word: "sick", sign: "𝠃𝤫𝥅񋾡𝣴𝣵񄧡𝤍𝣮񄧪𝣯𝤠񆇡𝤃𝤺", video: "/videos/whatsthatsign/sick/sick.mp4" },
    { word: "value", sign: "𝠃𝤝𝤜񄵑𝤇𝣱񄵙𝣰𝣱񆉁𝣻𝤑", video: "/videos/whatsthatsign/value/value.mp4" },
    { word: "nothing", sign: "𝠃𝤥𝤫񄵡𝤏𝣡񄵩𝣧𝣡񈩣𝤑𝤃񈩷𝣭𝤃", video: "/videos/whatsthatsign/nothing/nothing.mp4" },
    { word: "", placeholder: true },
    { word: "sew", sign: "𝠃𝤣𝤠񄶉𝣪𝣭񄶁𝤀𝣭񆕁𝣺𝤍񋗯𝤈𝤉", video: "/videos/whatsthatsign/sew/sew.mp4" },
    { word: "pepper", sign: "𝠃𝤚𝤠񄶑𝣿𝣭񇑅𝣳𝤏", video: "/videos/whatsthatsign/pepper/pepper.mp4" },
  ],
  9: [
    { word: "Georgia", sign: "𝠃𝤕𝤗񅨁𝣸𝣵񅳁𝤁𝤈", video: "/videos/whatsthatsign/georgia/georgia.mp4" },
    { word: "guard", sign: "𝠃𝤡𝤑񅨙𝤄𝣼񅨑𝣫𝤂", video: "/videos/whatsthatsign/guard/guard.mp4" },
    { word: "group", sign: "𝠃𝤥𝤜񅨡𝤈𝤍񅨩𝣨𝤍񋎧𝤈𝣱񋎿𝣱𝣱", video: "/videos/whatsthatsign/group/group.mp4" },
    { word: "errands", sign: "𝠃𝤣𝤤񅮸𝤌𝣳񅯀𝣬𝣳񆱴𝤐𝣨񆱶𝣩𝣨񋟇𝤊𝤕񋟗𝣪𝤕", video: "/videos/whatsthatsign/errands/errands.mp4" },
    { word: "big", sign: "𝠃𝤪𝤟񅒡𝤒𝣭񅒩𝣤𝣭񉌆𝤖𝤋񉌞𝣣𝤋", video: "/videos/whatsthatsign/big/big.mp4" },
    { word: "language", sign: "𝠃𝤩𝤡񅋑𝤈𝣫񅋙𝣭𝣫񉌆𝤕𝤍񉌞𝣤𝤍", video: "/videos/whatsthatsign/language/language.mp4" },
  ],
  10: [
    { word: "game", sign: "𝠃𝤖𝤙񅯣𝤇𝣴񅯫𝣷𝣴񆉁𝣼𝤎", video: "/videos/whatsthatsign/game/game.mp4" },
    { word: "back", sign: "𝠃𝤭𝤢񋾡𝣴𝣵񅯱𝤞𝤁񈗥𝤟𝤓", video: "/videos/whatsthatsign/back/back.mp4" },
    { word: "mail", sign: "𝠃𝤟𝥜񍘡𝣴𝣵񅯣𝣾𝤐񆿆𝤄𝤫񅯫𝣿𝥄񅰁𝤇𝤻", video: "/videos/whatsthatsign/mail/mail.mp4" },
    { word: "dresser", sign: "𝠃𝤨𝤢񆅑𝤙𝣫񆅙𝣥𝣫񆿥𝤀𝤉񈗥𝤚𝤁񈗥𝤚𝤓񈗵𝣥𝤁񈗵𝣥𝤓", video: "/videos/whatsthatsign/dresser/dresser.mp4" },
    { word: "pass", sign: "𝠃𝤖𝤣񅰡𝤇𝤋񅰩𝣷𝤀񆕁𝤉𝣻񈗡𝤈𝣩", video: "/videos/whatsthatsign/pass/pass.mp4" },
    { word: "area", sign: "𝠃𝤟𝤘񅰱𝤇𝣴񅰹𝣭𝣴񊿫𝤌𝤈񊿳𝣭𝤈", video: "/videos/whatsthatsign/area/area.mp4" },
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
