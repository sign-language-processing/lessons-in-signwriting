import { MatchingPractice } from "../components/MatchingPractice";
import { WritingPractice } from "../components/WritingPractice";
import { PracticeLaunchCard } from "../components/PracticeChrome";

export function Ch16Practice() {
  return (
    <>
      <h2 id="chapter-16">Chapter 16 — Practice</h2>
      <p>
        The earlier chapters teach the symbols one group at a time. This chapter
        puts them back together. Each drill works from a real signed video, so you
        practice connecting the writing to the language — matching, reading, and
        writing signs. Come back often; these skills grow with repetition.
      </p>

      <h2>Matching Practice</h2>
      <p>
        Watch the sign, then choose the SignWriting that records it. The other
        three are real signs too — look at the handshapes, contact and movement
        to tell them apart.
      </p>
      <MatchingPractice />

      <h2>Writing Practice</h2>
      <p>
        Now write it yourself. Watch the sign, then build the missing part — the
        hands, the contact, the movement, the face, or the whole sign — in the
        SignWriting keyboard. Press <strong>Save</strong> in the keyboard to
        check your answer against the original.
      </p>
      <WritingPractice />

      <h2>Reading Practice</h2>
      <p>
        Read a sign written in SignWriting and perform it to your webcam — the
        true test that you can read it, not just recognize it.
      </p>
      <PracticeLaunchCard label="🎥 Reading Practice" hint="Coming soon." disabled />
    </>
  );
}
