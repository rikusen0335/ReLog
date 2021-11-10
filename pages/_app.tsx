import { AppProps } from 'next/app'
import React from 'react'
import '../styles/index.css'
import "../styles/night-owl-no-italic.css"
import "../styles/prism-highlight.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
