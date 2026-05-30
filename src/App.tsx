import { Sidebar } from "./components/Sidebar";
import { SymbolDialogProvider } from "./components/SymbolDialogContext";
import { asset } from "./lib/asset";
import { AUTHORING } from "./lib/devMode";
import { Ch1Introduction } from "./chapters/Ch1Introduction";
import { Ch2Viewpoints } from "./chapters/Ch2Viewpoints";
import { Ch3Hands } from "./chapters/Ch3Hands";
import { Ch4Contact } from "./chapters/Ch4Contact";
import { Ch5FingerMovement } from "./chapters/Ch5FingerMovement";
import { Ch6StraightMovement } from "./chapters/Ch6StraightMovement";
import { Ch7CurvedMovement } from "./chapters/Ch7CurvedMovement";
import { Ch8AxialMovement } from "./chapters/Ch8AxialMovement";
import { Ch9CircularMovement } from "./chapters/Ch9CircularMovement";
import { Ch10Face } from "./chapters/Ch10Face";
import { Ch11Head } from "./chapters/Ch11Head";
import { Ch12Body } from "./chapters/Ch12Body";
import { Ch13Dynamics } from "./chapters/Ch13Dynamics";
import { Ch14Punctuation } from "./chapters/Ch14Punctuation";
import { Ch15WritingSigns } from "./chapters/Ch15WritingSigns";

export function App() {
  return (
    <SymbolDialogProvider>
      <Sidebar />
      <div className="page">
        <Ch1Introduction />
        <Ch2Viewpoints />
        <Ch3Hands />
        <Ch4Contact />
        <Ch5FingerMovement />
        <Ch6StraightMovement />
        <Ch7CurvedMovement />
        <Ch8AxialMovement />
        <Ch9CircularMovement />
        <Ch10Face />
        <Ch11Head />
        <Ch12Body />
        <Ch13Dynamics />
        <Ch14Punctuation />
        <Ch15WritingSigns />
      </div>
      {AUTHORING && (
        <aside className="pdf-debug" data-no-print aria-label="Source PDF (for debugging)">
          <iframe
            src={`${asset("/pdfjs/web/viewer.html")}?file=${asset("/sw0116-Lessons-SignWriting.pdf")}`}
            title="Source PDF"
          />
        </aside>
      )}
    </SymbolDialogProvider>
  );
}
