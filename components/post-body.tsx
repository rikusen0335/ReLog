import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react'
import markdownStyles from './markdown-styles.module.css'

type Props = {
    source: unknown;
}

const components: Record<string, React.ReactNode> = {
    h1: (props) => <h1 {...props} className="mt-12 mb-4 text-3xl leading-snug" />,
    h2: (props) => <h2 {...props} className="mt-8 mb-4 text-2xl leading-snug" />,
    h3: (props) => <h3 {...props} className="mt-6 mb-4 text-xl leading-snug" />,
    p: (props) => <p {...props} className="mb-4 text-lg leading-relaxed" />
}

const PostBody = ({ source }: Props) => {
    return (
        <div className="max-w-2xl mx-auto">
            <MDXRemote {...source} components={components} />
        </div>
    )
}

export default PostBody
