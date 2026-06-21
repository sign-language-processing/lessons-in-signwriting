import { ContactExplorer } from "../components/ContactExplorer";

export function Ch4Contact() {
  return (
    <>
      <h2 id="chapter-4">Chapter 4 — Contact</h2>
      <p>
        A <strong>contact symbol</strong> marks where and how the hands meet —
        each other, or a part of the body. Write it close to where the contact
        happens, never between the two contacting symbols. A light touch usually
        implies its own movement, so you rarely need a movement arrow alongside
        it. The full rules for placing contact at the center of a sign are in{" "}
        <a href="#chapter-15">Chapter 15</a>.
      </p>
      <ContactExplorer />
      <p>
        Beyond the <em>type</em> of contact, SignWriting also has{" "}
        <strong>surface symbols</strong> that clarify <em>which</em> surfaces
        meet — useful when the usual writing would leave it ambiguous how two
        parts touch. They are specialized; for the full set, see{" "}
        <a
          href="https://www.signwriting.org/archive/docs13/sw1283_A_GRAMMAR_OF_SIGNWRITING_by_Stuart_Thiessen.pdf"
          target="_blank"
          rel="noreferrer"
        >
          A Grammar of SignWriting
        </a>{" "}
        by Stuart Thiessen, pages 119–121.
      </p>
    </>
  );
}
