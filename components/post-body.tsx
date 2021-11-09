import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react'
import markdownStyles from './markdown-styles.module.css'
import cn from "classnames"

type Props = {
    source: unknown;
}

const components: Record<string, React.ReactNode> = {
    h1: (props) => <h1 {...props} className={cn("mt-8 mb-4 text-3xl leading-snug", props.className)}># {props.children}</h1>,
    h2: (props) => <h2 {...props} className={cn("mt-4 mb-4 text-2xl leading-snug", props.className)}># {props.children}</h2>,
    h3: (props) => <h3 {...props} className={cn("mt-2 mb-4 text-xl leading-snug", props.className)}># {props.children}</h3>,
    p: (props) => <p {...props} className={cn("mb-4 text-base leading-relaxed", props.className)} />,
    // Reference: https://stackoverflow.com/questions/67945559/next-mdx-remote-doesnt-pass-the-component
    inlineCode: (props) => <code {...props} style={{color: "#ff6ac1"}} className={cn("py-[0.1rem] px-1 mx-1 bg-gray-200 rounded", props.className)} />,
}

const PostBody = ({ source }: Props) => {
    return (
        <div className="max-w-2xl mx-auto">
            <MDXRemote {...source} components={components} />
        </div>
    )
}

export default PostBody
