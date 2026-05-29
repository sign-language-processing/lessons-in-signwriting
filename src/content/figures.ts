import contact from "./contact-figures.generated.json";
import finger from "./finger-figures.generated.json";
import ch6 from "./ch6-figures.generated.json";
import ch7 from "./ch7-figures.generated.json";
import ch8 from "./ch8-figures.generated.json";
import ch9 from "./ch9-figures.generated.json";
import ch10 from "./ch10-figures.generated.json";
import ch12 from "./ch12-figures.generated.json";
import ch13 from "./ch13-figures.generated.json";
import ch14 from "./ch14-figures.generated.json";
import ch15 from "./ch15-figures.generated.json";

export type FigureData = {
  word?: string;
  illustration?: string;
  sign?: string;
  swu?: string;
  video?: string;
  confirmed?: boolean;
};

/** All book figures (illustration/sign/word + optional whatsthatsign match),
 * keyed by section-prefixed slug, merged across chapters. */
export const figures: Record<string, FigureData> = {
  ...contact,
  ...finger,
  ...ch6,
  ...ch7,
  ...ch8,
  ...ch9,
  ...ch10,
  ...ch12,
  ...ch13,
  ...ch14,
  ...ch15,
};
