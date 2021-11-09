import { AppProps } from 'next/app'
import React from 'react'
import '../styles/index.css'
import "../styles/atom-dark.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
