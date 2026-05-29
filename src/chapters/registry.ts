export const CHAPTERS = [
  { id: "chapter-1", title: "Introduction" },
  { id: "chapter-2", title: "Viewpoints" },
  { id: "chapter-3", title: "Hands" },
  { id: "chapter-4", title: "Contact" },
  { id: "chapter-5", title: "Finger Movement" },
  { id: "chapter-6", title: "Straight Movement" },
  { id: "chapter-7", title: "Curved Movement" },
  { id: "chapter-8", title: "Axial Movement" },
  { id: "chapter-9", title: "Circular Movement" },
  { id: "chapter-10", title: "Face" },
  { id: "chapter-11", title: "Head" },
  { id: "chapter-12", title: "Body" },
  { id: "chapter-13", title: "Dynamics" },
  { id: "chapter-14", title: "Punctuation" },
  { id: "chapter-15", title: "Writing Signs & Sign Literature" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];
