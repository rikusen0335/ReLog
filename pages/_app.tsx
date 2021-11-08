import { AppProps } from 'next/app'
import { MDXProvider, MDXProviderComponentsProp } from "@mdx-js/react"
import React from 'react'
import '../styles/index.css'
import "../styles/atom-dark.css";

const components: MDXProviderComponentsProp = {
    h1: (props) => <h1 {...props} className="mt-12 mb-4 text-3xl leading-snug" />,
    h2: (props) => <h2 {...props} className="mt-8 mb-4 text-2xl leading-snug" />,
    h3: (props) => <h3 {...props} className="mt-6 mb-4 text-xl leading-snug" />,
    p: (props) => <p {...props} className="mb-4 text-lg leading-relaxed" />
}

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
