import LightboxComponent, {
  type LightboxExternalProps,
} from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

/**
 * The purpose of this intermediate component is to load the Lightbox and
 * its CSS dynamically only when the lightbox becomes interactive
 */
export default function Lightbox(props: LightboxExternalProps) {
  return <LightboxComponent {...props} />;
}
