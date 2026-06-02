import { convert } from "@sutton-signwriting/core";
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const INDEX_CSV = path.join(HERE, "whatsthatsign_index.csv");

export function parseCSV(text) {
  const rows = [];
  let i = 0,
    field = "",
    row = [],
    inQuote = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuote = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuote = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// The signbox is the layout half of an FSW string (from the first M/L/B/R box
// marker). Dropping the leading "A…" query prefix makes two encodings of the
// same physical sign compare equal — that prefix varies between sources.
export function signboxFsw(fsw) {
  const m = fsw.match(/[MLBR]\d/);
  return m ? fsw.slice(m.index) : fsw;
}

// A handshape/sign SWU as stored in the manifests → its signbox FSW key.
export function canonFromSwu(swu) {
  return signboxFsw(convert.swu2fsw(swu));
}

export function loadIndex() {
  const csv = parseCSV(fs.readFileSync(INDEX_CSV, "utf8"));
  const header = csv[0];
  const fileIdx = header.indexOf("file");
  const extraIdx = header.indexOf("extra");
  const out = [];
  for (let r = 1; r < csv.length; r++) {
    const file = csv[r][fileIdx];
    const fsw = JSON.parse(csv[r][extraIdx]).sign_fsw;
    out.push({ file, fsw, canon: signboxFsw(fsw) });
  }
  return out;
}
