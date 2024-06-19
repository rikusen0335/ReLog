import React, { ComponentPropsWithoutRef, useEffect } from "react";
import Zoom from "react-medium-image-zoom";

type Props = ComponentPropsWithoutRef<"img"> & {};

export const Image = ({ ...rest }: Props) => {
	return (
		<Zoom
			overlayBgColorEnd="rgba(0, 0, 0, 0.75)"
			overlayBgColorStart="rgba(0, 0, 0, 0)"
		>
			<img {...rest} />
		</Zoom>
	);
};
