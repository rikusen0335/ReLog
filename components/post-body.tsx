import React, { ComponentPropsWithoutRef } from "react";
import markdownStyles from "./markdown-styles.module.css";
import cn from "classnames";
import { getMDXComponent } from "mdx-bundler/client";

type Props = {
    source: string;
};

// TODO: ここの型付けマジでなんとかしたい
const components = {
    h1: (props: ComponentPropsWithoutRef<"h1">) => (
        <h1
            {...props}
            className={cn(
                "flex mt-8 mb-4 text-4xl leading-snug font-bold border-b pl-1 pb-2 border-gray-400",
                props.className
            )}
        >
            {props.children}
        </h1>
    ),
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
        <h2
            {...props}
            className={cn(
                "flex mt-4 mb-4 text-2xl leading-snug font-bold",
                props.className
            )}
        >
            {props.children}
        </h2>
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
        <h3
            {...props}
            className={cn("flex mt-2 mb-4 text-xl leading-snug", props.className)}
        >
            {props.children}
        </h3>
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
        <p
            {...props}
            className={cn("mb-4 text-base leading-relaxed", props.className)}
        />
    ),
    // Reference: https://stackoverflow.com/questions/67945559/next-mdx-remote-doesnt-pass-the-component
    inlineCode: (props: ComponentPropsWithoutRef<"h1">) => (
        <code
            {...props}
            style={{ color: "#ff6ac1" }}
            className={cn(
                "py-[0.1rem] px-1 mx-1 bg-gray-200 rounded",
                props.className
            )}
        />
    ),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
        <ul
            {...props}
            className={cn("mb-4 list-disc list-inside", props.className)}
        />
    ),
    ol: (props: ComponentPropsWithoutRef<"ol">) => (
        <ol
            {...props}
            className={cn("mb-4 list-decimal list-inside", props.className)}
        />
    ),
    hr: (props: ComponentPropsWithoutRef<"hr">) => (
        <hr {...props} className={cn("my-12 border-gray-300", props.className)} />
    ),
    table: (props: ComponentPropsWithoutRef<"table">) => (
        <table
            {...props}
            className={cn(
                "items-center bg-transparent w-full border-collapse my-4 54  ",
                props.className
            )}
        />
    ),
    tr: (props: ComponentPropsWithoutRef<"tr">) => (
        <tr {...props} className={cn("group", props.className)} />
    ),
    th: (props: ComponentPropsWithoutRef<"th">) => (
        <th
            {...props}
            className={cn(
                "px-6 bg-gray-100 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left",
                props.className
            )}
        />
    ),
    td: (props: ComponentPropsWithoutRef<"td">) => (
        <td
            {...props}
            className={cn(
                "border-t-0 bg-[#fcfcfd] group-hover:bg-[#f7f7f9] border-b px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4",
                props.className
            )}
        />
    ),
    pre: (props: ComponentPropsWithoutRef<"pre">) => (
        <pre {...props} className={cn("!mt-0 !mb-4", props.className)} />
    ),
    blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
        <blockquote
            {...props}
            className={cn(
                "pl-3 p-2 mx-2 my-2 bg-gray-100 mb-4 border-l-4 border-gray-400 rounded-r-lg;",
                props.className
            )}
        />
    ),
};

const PostBody = ({ source }: Props) => {
    const MDXRenderer = React.useMemo(() => getMDXComponent(source), [source]);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="max-w-4xl px-16 py-8 mx-auto bg-[#fafafc] markdown">
                <MDXRenderer components={components} />
            </div>
        </div>
    );
};

export default PostBody;
