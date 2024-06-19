import { AppProps } from "next/app";
import React from "react";
import Script from "next/script";

import "../styles/index.scss";

import "../styles/night-owl-no-italic.css";
import "../styles/prism-highlight-and-lines.css";

// Custom css under here

import "react-medium-image-zoom/dist/styles.css";

import { ThemeButton } from "../components/theme-button";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Script strategy="beforeInteractive" src="/scripts/darkMode.js" />
			<Component {...pageProps} />
			<div className="fixed top-0 right-0 mt-12 mr-8">
				<ThemeButton />
			</div>
		</>
	);
}
