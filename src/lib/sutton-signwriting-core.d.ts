declare module "@sutton-signwriting/core" {
  export const convert: {
    swu2key: (swuSym: string) => string;
    key2swu: (key: string) => string;
    swu2id: (swuSym: string) => number;
    id2swu: (id: number) => string;
    swu2code: (swuSym: string) => number;
    code2swu: (code: number) => string;
    key2id: (key: string) => number;
    id2key: (id: number) => string;
    key2symid: (key: string) => string;
    symid2key: (symid: string) => string;
    symidArr: readonly string[];
  };
}
