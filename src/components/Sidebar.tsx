import { CHAPTERS } from "../chapters/registry";
import { GoogleTranslate } from "./GoogleTranslate";

export function Sidebar() {
  return (
    <nav className="toc-sidebar" data-no-print>
      <h2>Table of Contents</h2>
      <ol className="toc">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`}>{c.title}</a>
          </li>
        ))}
      </ol>
      <GoogleTranslate />
    </nav>
  );
}
