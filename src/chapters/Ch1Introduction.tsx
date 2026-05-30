import { SgnwSign } from "../components/Sgnw";
import { asset } from "../lib/asset";

const VALERIE_IMG =
  "image_000011_1738bb5aa2102114bff889f8c476e8e655ab9eb25cfa21890a469f23d56110ef.png";
const VALERIE_SIGN = "𝠃𝤘𝥨񂇇𝣵𝤠񀕡𝤀𝤮񉨬𝣴𝥅񍝁𝣴𝣵񌏁𝣴𝣵";
const ADAM_IMG =
  "image_000016_8b33582f66ff71f5f93269139bb77797b3d9829fc91ab2b68f555b073d0016db_adam.png";
const ADAM_SIGN = "𝠀񆄢񆷦񆷢񎣡𝠃𝤛𝤛񎣡𝣱𝣲񆄢𝣬𝤆񆷢𝣢𝤆񆷦𝣩𝣺";
const LUCINDA_IMG =
  "image_000016_8b33582f66ff71f5f93269139bb77797b3d9829fc91ab2b68f555b073d0016db_lucinda.png";
const KEVIN_IMG =
  "image_000016_8b33582f66ff71f5f93269139bb77797b3d9829fc91ab2b68f555b073d0016db_kevin.png";
const LUCINDA_SIGN = "𝠀񂣱񆉁񌏁񍝁𝠃𝤡𝤷񌏁𝣴𝣴񍝁𝣴𝣴񂣱𝤌𝤕񆉁𝤋𝤬";
const KEVIN_SIGN = "𝠃𝤝𝥈񁠨𝣲𝤡񈩣𝤎𝤠񌏁𝣴𝣵񍝁𝣴𝣵";
const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

export function Ch1Introduction() {
  return (
    <>
      <h1>Lessons in SignWriting — Interactive Edition</h1>
      <h2 id="chapter-1">Chapter 1 — Introduction</h2>

      <p>
        First Edition published in 1990 Second Edition published in 1995 Third
        Edition published in 2002 Fourth Edition published in 2014{" "}
        <strong>Interactive Edition 2026</strong>
      </p>
      <p>
        Original content © 1990–2014 Valerie Sutton &amp; the Center for Sutton
        Movement Writing, Inc. Interactive edition © 2026 Nagish Inc. Both editions
        licensed under{" "}
        <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
      </p>
      <p>The SignWriting System was first invented by Valerie Sutton in 1974.</p>
      <p>
        Cartoons by Frank Allen Paul Illustrations by Ida Candelaria &amp; Jayne
        Gunderson Photos of Hands &amp; Body Diagrams by Adam Frost
      </p>
      <p>
        Photos of Kevin Clark &amp; Lucinda O'Grady are captured from the
        Lessons In SignWriting Video Series DVD
      </p>
      <p>SignWriting web components by Stephen E. Slevinski, Jr</p>

      <h3>Contributors</h3>
      <p>
        With contributions and photos from members of the Deaf Action Committee
        for SignWriting (the DAC) including…
      </p>
      <div className="contributors-grid">
        <figure className="contributor-portrait">
          <img src={`${ART}/${VALERIE_IMG}`} alt="Valerie Sutton" />
          <SgnwSign sign={VALERIE_SIGN} video="/videos/names/valerie.mp4" />
          <figcaption>Valerie Sutton</figcaption>
        </figure>
        <figure className="contributor-portrait">
          <img src={`${ART}/${ADAM_IMG}`} alt="Adam Frost" />
          <SgnwSign sign={ADAM_SIGN} />
          <figcaption>Adam Frost</figcaption>
        </figure>
        <figure className="contributor-portrait">
          <img src={`${ART}/${LUCINDA_IMG}`} alt="Lucinda O'Grady Batch" />
          <SgnwSign sign={LUCINDA_SIGN} />
          <figcaption>Lucinda O'Grady Batch</figcaption>
        </figure>
        <figure className="contributor-portrait">
          <img src={`${ART}/${KEVIN_IMG}`} alt="Kevin Clark" />
          <SgnwSign sign={KEVIN_SIGN} />
          <figcaption>Kevin Clark</figcaption>
        </figure>
      </div>

      <h3>A Deaf Perspective</h3>
      <div className="contributor">
        <p>
          I am writing to tell you how strongly I feel about SignWriting and how
          much it can benefit Deaf people. I was born Deaf to a Deaf family and
          I am a native American Sign Language (ASL) user. I have been working
          with SignWriting since 1982. I was the first Deaf person to write
          articles in ASL, in SignWriting, for the SignWriter Newspaper. Later,
          Valerie Sutton and I established the Deaf Action Committee for
          SignWriting (the DAC) in 1988. I think it is very important to spread
          the word about SignWriting. ASL is a language in its own right, yet
          until the development of SignWriting, it was a language without a
          written form. When I found out about SignWriting I was thrilled to
          think that at last we would have a way to write our language. Deaf
          Americans are one of the very few linguistic minorities that are
          unable to get books teaching English in their native language. I feel
          that we can use SignWriting in order to learn English. Deaf people
          will benefit greatly from books explaining English grammar and idioms
          in written ASL. We can also use it to write down and preserve our
          stories, poetry and plays. As you know, there are many Deaf
          playwrights and poets, and up until now, they have not had a way to
          write the ASL in their literature. No matter what the project,
          SignWriting encourages us to read and write and I feel that is
          important. All of us hope that you will enjoy learning SignWriting.
          Your interest and support is a great help to our Deaf community.
        </p>
        <p>— Lucinda O'Grady Batch</p>
      </div>
    </>
  );
}
