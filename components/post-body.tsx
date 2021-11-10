import React from 'react'
import markdownStyles from './markdown-styles.module.css'
import cn from "classnames"
import { getMDXComponent } from 'mdx-bundler/client'

type Props = {
    source: string;
}

const components = {
    h1: (props) => <h1 {...props} className={cn("flex mt-8 mb-4 text-4xl leading-snug font-bold border-b pl-1 pb-2 border-gray-400", props.className)}>{props.children}</h1>,
    h2: (props) => <h2 {...props} className={cn("flex mt-4 mb-4 text-2xl leading-snug font-bold", props.className)}>{props.children}</h2>,
    h3: (props) => <h3 {...props} className={cn("flex mt-2 mb-4 text-xl leading-snug", props.className)}>{props.children}</h3>,
    p: (props) => <p {...props} className={cn("mb-4 text-base leading-relaxed", props.className)} />,
    // Reference: https://stackoverflow.com/questions/67945559/next-mdx-remote-doesnt-pass-the-component
    inlineCode: (props) => <code {...props} style={{color: "#ff6ac1"}} className={cn("py-[0.1rem] px-1 mx-1 bg-gray-200 rounded", props.className)} />,
    ul: (props) => <ul {...props} className={cn("mb-4 list-disc list-inside", props.className)} />,
    ol: (props) => <ol {...props} className={cn("mb-4 list-decimal list-inside", props.className)} />,
    hr: (props) => <hr {...props} className={cn("my-6", props.className)} />,
    table: (props) => <table {...props} className={cn("items-center bg-transparent w-full border-collapse my-4 54  ", props.className)} />,
    th: (props) => <th {...props} className={cn("px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-blueGray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left", props.className)} />,
    td: (props) => <td {...props} className={cn("border-t-0 border-b px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4", props.className)} />,
    pre: (props) => <pre {...props} className={cn("!mt-0 !mb-4", props.className)} />,
    blockquote: (props) => <blockquote {...props} className={cn("pl-3 p-2 mx-2 my-2 bg-gray-100 mb-4 border-l-4 border-gray-400 rounded-r-lg;", props.className)} />,
}

const PostBody = ({ source }: Props) => {
    const MDXRenderer = React.useMemo(() => getMDXComponent(source), [source])
    return (
        <div className="max-w-4xl mx-auto markdown">
            <MDXRenderer components={components} />
        </div>
    )
}

export default PostBody
