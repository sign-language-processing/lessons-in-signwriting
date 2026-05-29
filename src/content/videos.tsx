import type { ReactNode } from "react";

export const VIDEO_CREDITS = (
  <>
    <p>
      <em>Lessons in SignWriting® Video Series</em>
    </p>
    <ul>
      <li>Created by Valerie Sutton</li>
      <li>Featuring Lucinda O'Grady Batch and Kevin Clark</li>
      <li>Voice-Over &amp; English Script for Kevin Clark by Pasch McCombs</li>
      <li>All Other Voice-Over &amp; English Scripts by Valerie Sutton</li>
      <li>
        Lesson plans, poster diagrams, book layout &amp; design by Valerie
        Sutton
      </li>
      <li>
        SignWriter® Computer Program designed and programmed by Richard
        Gleaves
      </li>
      <li>
        Video Production Facility: Lightning Corporation, San Diego, California
      </li>
      <li>On-line Editor: Thomas Kihneman</li>
      <li>Published by the DAC, The Deaf Action Committee For SignWriting®</li>
      <li>Sponsored by The Center For Sutton Movement Writing, Inc.</li>
      <li>Copyright © 1995 Center for Sutton Movement Writing, Inc.</li>
      <li>ISBN: 0-914336-72-X</li>
    </ul>
  </>
);

function Line({
  speaker,
  children,
}: {
  speaker: string;
  children: ReactNode;
}) {
  return (
    <p style={{ marginBlock: "0.5em" }}>
      <strong>{speaker}:</strong> {children}
    </p>
  );
}

export const TRANSCRIPT_1 = (
  <>
    <Line speaker="Cindy">
      Hi! My name is Lucinda O'Grady Batch. Welcome to our video series
      "Lessons In Sign Writing".
    </Line>
    <Line speaker="Kevin">
      Hello. My name is Kevin Clark. You know, I have been involved with
      American Sign Language research for some time now, so I want to learn
      SignWriting. But I'm curious. What exactly is SignWriting used for?
    </Line>
    <Line speaker="Cindy">
      The two of us were born Deaf, from Deaf families. We grew up using
      American Sign Language, or ASL, our native language. We need a way to
      preserve our language. SignWriting copies exact movements of signs rather
      than using English to describe ASL.
    </Line>
    <Line speaker="Kevin">Oh. I see. I'm curious. Who uses SignWriting?</Line>
    <Line speaker="Cindy">
      Sign Language researchers, hearing students who need a way to write new
      signs, Deaf people who want to write ASL poetry, plays, stories, in
      school education, &amp; also other countries, such as Norway, Denmark,
      Ireland, &amp; England are starting to write their own signed languages
      using SignWriting.
    </Line>
    <Line speaker="Kevin">
      I see. That's good. You know, that makes sense because spoken languages
      have a way to write their own languages. But we as Deaf people, haven't
      really had a way to write our signed languages. Now, with this system, it
      seems possible to do that.
    </Line>
    <Line speaker="Cindy">
      Right. The purpose of this video is to show a few handshapes, movement,
      contact, and facial expressions, and to show a sign sentence written in
      ASL. Now I'll teach…you learn.
    </Line>
    <Line speaker="Kevin">Do you have an example? Like the sign "to know"?</Line>
    <Line speaker="Cindy">
      Yes. Let me show you a few things. The circle represents the head. Look
      at the hand symbol. The dark part means the "back of the hand". The two
      contact stars mean "two times contact".
    </Line>
    <Line speaker="Kevin">So the two asterisks mean "two contacts"?</Line>
    <Line speaker="Cindy">
      Yes. That's correct. The sign is "to know". It is from the Expressive
      point of view. Imagine that you are looking through the back of the head
      and feeling it on the right side of the head.
    </Line>
    <Line speaker="Kevin">Can you represent exact locations on the head?</Line>
    <Line speaker="Cindy">
      Oh yes. We can do that. Let me show you the sign for "know" lower on the
      cheek. The circle represents the head. The handshape is at an angle,
      touching the cheek. We have two stars for contact. Next we have the
      facial expression with the mouth up on the right side.
    </Line>
    <Line speaker="Kevin">So is this face looking out toward the viewer?</Line>
    <Line speaker="Cindy">
      Well, not really. Try to imagine looking through the back of the head
      and feeling it for yourself on the right side of your own face. In this
      diagram one sign is for the right side, and the other one is for the
      left side.
    </Line>
    <Line speaker="Kevin">Is that handshape the "D" handshape?</Line>
    <Line speaker="Cindy">
      No. It is not a "D" handshape. It is the "index" handshape. It is the
      closed fist with the finger sticking up.
    </Line>
    <Line speaker="Kevin">Would you like me to try writing this?</Line>
    <Line speaker="Cindy">
      Sure. Remember to write the sign, signed with the left hand. (Later:)
      That is very good. Let us see if it fits. Perfect!
    </Line>
    <Line speaker="Kevin">This seems more comfortable reading it this way.</Line>
    <Line speaker="Cindy">
      Yes. I think so. It seems that we Deaf people prefer to write down the
      page, but of course, we are still experimenting. Maybe we'll throw out
      writing from left to right, and start writing down the page all the
      time. Who knows?!
    </Line>
    <Line speaker="Kevin">This seems to be printed by computer. Is that right?</Line>
    <Line speaker="Cindy">
      Yes. That's right. This was printed by computer. We have a computer
      program called "SignWriter®" that is really a "sign language processing
      program", a little like a "word processing program", but now the signs
      pop up while you are typing along the screen. It is a nice way to write
      SignWriting.
    </Line>
    <Line speaker="Kevin">
      Yeah. It seems like this offers a person a choice to write by hand or
      use the computer.
    </Line>
    <Line speaker="Cindy">
      Yes. That's right. Well, I guess we are finished with this lesson.
      Goodbye!!
    </Line>
  </>
);

export const TRANSCRIPT_2 = (
  <>
    <Line speaker="Cindy">
      Hi! My name is Lucinda O'Grady Batch. Welcome to our video series
      "Lessons in SignWriting". This second video is called "SignWriting
      Basics". I will teach basic handshapes, contact symbols, and movement
      symbols necessary for reading basic SignWriting.
    </Line>
    <Line speaker="Kevin">
      Hi. My name is Kevin Clark. I enjoyed the first video very much. I
      learned a lot too!
    </Line>
    <Line speaker="Cindy">
      That's great. The first video was called "Introduction to SignWriting".
      Beginning students should watch that video first, then this one second.
      Remember what we discussed in the first video?
    </Line>
    <Line speaker="Kevin">
      Yes. First we discussed what SignWriting is used for. It is used for
      reading, writing, and preserving American Sign Language, or ASL, our
      native language. Also for writing signed languages from other countries.
    </Line>
    <Line speaker="Cindy">
      Yes. That's right. We also discussed the Expressive and Receptive
      viewpoints. We write signs Expressively. Remember what that means?
    </Line>
    <Line speaker="Kevin">
      Yes. We read and write ASL from our own Expressive viewpoint, looking at
      our own hands. We don't write how another person signs…we write our own
      signing.
    </Line>
    <Line speaker="Cindy">
      That's right. I showed a few basic symbols, signs, and an ASL sentence
      "written-across-page-from-left-to-right", also "down-the-page".
    </Line>
    <Line speaker="Kevin">
      Yes. I remember. That was really interesting. I like writing
      "down-the-page" myself.
    </Line>
    <Line speaker="Cindy">
      Yes. I too. It is important that you view the first video to receive all
      that information in depth. Now we will begin SignWriting Basics.
    </Line>
    <Line speaker="Cindy">
      First let me show you three basic handshapes. Look at the top symbol. It
      is a square for the fist. It represents a closed fist. The next symbol
      is a circle. Why? Because the fingertips touch each other. It is not a
      closed fist like the square. It is an open fist, a circle. The third
      symbol is the flat hand. You see the palm of the hand. The fingers are
      tight together. That is the flat hand.
    </Line>
    <Line speaker="Cindy">
      Now let's look at the next row of symbols. Remember the square for the
      fist? Imagine a finger sticking up. As you can see in the top diagram,
      you have the square for the fist with a line for the finger. In the
      second symbol, you can see the circle, but now a line is added to show
      the finger sticking up. Looking at the last symbol. We have a flat hand
      with the fingers spread.
    </Line>
    <Line speaker="Kevin">
      Ok. So one finger is sticking up in the "D" handshape, but what would
      happen if two fingers were sticking up?
    </Line>
    <Line speaker="Cindy">
      If two fingers were sticking up, you would add another line to the
      circle. The handshape is a circle because it is an "open fist". No
      fingers are touching the palm of the hand.
    </Line>
    <Line speaker="Kevin">You mean you wouldn't use the square symbol?</Line>
    <Line speaker="Cindy">
      No. Well…if you had a closed fist with two fingers sticking up then yes,
      you would use the square symbol. Remember that the square means a
      "closed fist". The fingertips are touching the palm of the hand. But the
      circle means that the fingertips are touching each other.
    </Line>
    <Line speaker="Cindy">
      Let me explain two different planes. Up-Down, and Forward-Back. Look at
      the left row of symbols. The index finger is pointing up. First the palm
      is facing you. Then you see the side view. Then you see the back of the
      hand. The right row of symbols are hands parallel with the floor. How do
      you know that? Because there is a break in the finger line…a space at
      the knuckle joint. That space means the hand is parallel with the floor.
    </Line>
    <Line speaker="Cindy">
      So in review…the row of symbols to the left have the finger line
      connected to the square. That means the hands are up or down, parallel
      with the wall. When you see the space, the hand is parallel with the
      floor. First the palm is up, then the side view, and then the back of
      the hand.
    </Line>
    <Line speaker="Cindy">
      Now let me show you a few signs. Look at the sign for "argue" at the top
      left of the chart. We have the two Index Hands facing the body, and then
      we have the movement arrows. The dark arrowhead is movement with the
      right hand, and the light arrowhead is movement with the left hand. The
      little curved line means that the movement is done with both hands at
      the same time (Simultaneous Line). Look at the next sign, for "sign".
      Notice the two circles. The circles are moving in an alternating
      fashion, and they are done twice because there are two arrowheads.
    </Line>
    <Line speaker="Kevin">
      So the finger line without a break means the hand is parallel with the
      wall, and the finger line with the break means the hand is parallel
      with the floor?
    </Line>
    <Line speaker="Cindy">
      Right!! Now let me show you another handshape, the "D" hand, first
      parallel with the wall, or the Wall Plane and second, parallel with the
      floor, or the Floor Plane. Look at the top symbol to the left in the
      diagram. The palm is facing the body. The second symbol shows the side
      view, and the third symbol is the back view. Now, if the handshapes are
      parallel with the floor, they look different…
    </Line>
    <Line speaker="Kevin">Because there is a break in the line for the finger?</Line>
    <Line speaker="Cindy">
      Exactly. Look at the diagrams to the right on the chart. The hands are
      parallel with the floor. First you see the palm, then the side view,
      and then the back view…all parallel with the Floor Plane.
    </Line>
    <Line speaker="Cindy">
      Now let me show you some signs. Look at the sign at the top left of the
      chart. As you can see we have the "D" handshape facing your body.
    </Line>
    <Line speaker="Kevin">Does that curved line on the circle represent a frown?</Line>
    <Line speaker="Cindy">
      No. That is the "location" on the face where the hand contacts the
      face. The two asterisks represent contacting the chin two times. That
      is the sign for "dinner". Looking at the bottom, these three signs are
      parallel with the floor. Do you notice a difference between the signs
      for "dating" and "dessert"?
    </Line>
    <Line speaker="Kevin">
      Yes. The sign for "dating" has no break in the lines for the fingers,
      but the sign for "dessert" does, because the hands are parallel with
      the floor.
    </Line>
    <Line speaker="Cindy">
      Right!! The space at knuckle joint means hand is parallel with the
      floor.
    </Line>
    <Line speaker="Cindy">
      Here is another basic hand symbol, the Flat Hand. The symbols to the
      left are parallel with the front wall, or the Wall Plane. The symbol to
      the top left has the palm facing the body. The next symbol is the side
      view. And the third symbol is the back view. They are not parallel with
      the floor. They are parallel with the wall.
    </Line>
    <Line speaker="Cindy">
      The symbols to the right are parallel with the floor, or the Floor
      Plane. The symbol to the top right has the palm facing up. The next
      symbol is the side view. And the third symbol has the palm facing down.
      They are parallel with the floor because there is a break at the
      knuckle joint. Whenever you see a handshape that has a break at the
      knuckle joint, you know it is parallel with the floor.
    </Line>
    <Line speaker="Cindy">
      Here are some signs using the Flat Hand. On the top row you see the
      sign for "window", which has the palms facing the body. The arrows show
      movement with the right hand going up and down with contact. See the
      little curved line connecting the movement symbols in the sign for
      "house"? That means that the movements for the left and right hands
      are done at the same time. Looking at the bottom row, what is the
      difference between the signs for "things" and "children"?
    </Line>
    <Line speaker="Kevin">
      Well…the sign for "things" has the palm facing up, but the sign for
      "children" has the palm facing down.
    </Line>
    <Line speaker="Cindy">
      That's right! The only difference between the two signs is the palm
      orientation. The movement is exactly the same, it is just the palm
      facing that is different.
    </Line>
    <Line speaker="Cindy">
      Now we will focus on Contact Symbols. We will present three of them.
      Actually there are six Contact Symbols in all, but on this video we
      will focus on the three that are most commonly used. The first is the
      Touch Contact Symbol. It is a basic asterisk. Look at the sign for
      "dating". As you can see, there are two asterisks, meaning "two times
      contact". In the sign for "Deaf", we have the circle for the face and
      the Touch Contact Symbol shows contact on the face with the index
      finger.
    </Line>
    <Line speaker="Cindy">
      Here is the Brushing Contact Symbol. The Brush Symbol means that the
      movement is brushing "off the surface". It is the feeling of truly
      brushing the hands. Look at the sign for "monthly". The movement with
      the right hand brushes down twice, brushing "off" the surface.
    </Line>
    <Line speaker="Kevin">
      So this indicates two downward strokes for the sign "monthly"?
    </Line>
    <Line speaker="Cindy">Yes. That's right.</Line>
    <Line speaker="Cindy">
      Now we see the Rub Contact Symbol. This symbol gives the "feeling of
      rubbing". It moves and "stays on the surface". In the sign for "coffee"
      it rubs in a circle, almost as if you are stirring the coffee. In the
      sign for "temperature", however, we have movement arrows going up and
      down with the right hand…
    </Line>
    <Line speaker="Kevin">
      So the Rub Symbol makes a circular motion in the sign for
      "temperature"?
    </Line>
    <Line speaker="Cindy">
      Oh no. It really doesn't. Imagine if you threw out the movement arrows
      and you only had the Rub Symbol. Then it would be rubbing in a circle…
      but because we have the movement arrows, it means the rubbing is going
      in the direction of those arrows. Remember, the Rub Symbol represents
      movement that "stays on the surface". If it were the Brush Symbol, then
      it would move "off the surface" as in the sign for "monthly", but
      because it is the Rub Symbol, it "stays on the surface" as in the sign
      for "temperature".
    </Line>
    <Line speaker="Cindy">
      Now we will focus on movement symbols. We will show movement arrows on
      two different planes…the plane parallel with the wall and the plane
      parallel with the floor. Here we have the arrow with the double stem
      line. It means movement up or down, parallel with the wall. In this
      case, it is moving down. In the sign for "house", the movement arrow is
      a combination of first moving down diagonally and second moving
      straight down. Now, looking at the next symbol…it is parallel with the
      floor. It has a single stem. It means movement "forward".
    </Line>
    <Line speaker="Kevin">It's not movement upward?</Line>
    <Line speaker="Cindy">
      Oh no. It is not movement upward. If it were upward, it would have a
      double stem line, but the single stem line means that it is movement
      forward, parallel with the floor.
    </Line>
    <Line speaker="Cindy">
      Here we have a sentence that asks a question. First, we have the circle
      for the head. Can you see the little arrow above the circle?
    </Line>
    <Line speaker="Kevin">Yes. Does that mean the head moves upward?</Line>
    <Line speaker="Cindy">
      No. That means the head projects forward. And then you have the
      eyebrows up in a question. What do you think that thin &amp; thick line
      at the end means?
    </Line>
    <Line speaker="Kevin">The end of the sentence?</Line>
    <Line speaker="Cindy">
      Well. A little bit different. Do you remember before we learned that
      two lines can represent a pause or a break in a sentence, and a thick
      line marks the end of a sentence? Well, this is a combination of those
      two symbols. It is a little pause before the end of the sentence. It's
      like a question mark. An English translation of this sentence might be:
      "Are you Deaf?"
    </Line>
    <Line speaker="Cindy">
      Now let me show you another way of writing…writing down the page. Our
      first sentence was written from left to right across the page, but this
      new sentence is written down the page. Looking at the sign at the top
      of the sentence. Notice the eyebrows. They are down or in. The head is
      projecting forward. The question mark symbol at the end of the sentence
      is now horizontal instead of vertical. In English, this sentence could
      be translated: "Where is the house?"
    </Line>
    <Line speaker="Kevin">
      Wow!! SignWriting® is really nice because it has so many features that
      allow us to describe ASL. Yeah. We have facial expressions, movement
      symbols, hand symbols, everything is included. You know, it's really
      nice, because English has been used, in the past, for writing English
      glosses of ASL, but glosses just don't do justice to ASL, as
      SignWriting® does. It's nice to have our own way of writing our own
      language! And it's easier to read too!
    </Line>
    <Line speaker="Cindy">
      Ok. Well…I guess that's the end of this lesson! Goodbye!!
    </Line>
  </>
);
