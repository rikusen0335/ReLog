import dynamic from "next/dynamic";
import * as React from "react";
import type { LightboxExternalProps } from "yet-another-react-lightbox";

const Lightbox = dynamic(() => import("../components/lightbox"));
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function useLightbox() {
  const [open, setOpen] = React.useState(false);
  const [interactive, setInteractive] = React.useState(false);
  const [index, setIndex] = React.useState(0)

  const openLightbox = React.useCallback((index: number) => {
    setOpen(true);
    setInteractive(true);
    setIndex(index)
  }, []);

  const renderLightbox = React.useCallback(
    (props?: Omit<LightboxExternalProps, "open" | "close">) =>
      interactive ? (
        <Lightbox index={index} plugins={[Captions, Counter, Thumbnails, Zoom]} thumbnails={{ border: 0, borderRadius: 0 }} captions={{ descriptionTextAlign: 'center' }} open={open} close={() => setOpen(false)} {...props} />
      ) : null,
    [index, open, interactive]
  );

  return { openLightbox, renderLightbox };
}
