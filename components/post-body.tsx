import React, { ComponentPropsWithoutRef } from "react";
import markdownStyles from "./markdown-styles.module.css";
import cn from "classnames";
import { getMDXComponent } from "mdx-bundler/client";
import { useDarkMode } from "../hooks/useDarkMode";
import { ThemeButton } from "./theme-button";

type Props = {
    source: string;
};

// TODO: ここの型付けマジでなんとかしたい
const components = {
    h1: (props: ComponentPropsWithoutRef<"h1">) => (
        <h1
            {...props}
            className={cn(
                "flex mt-8 mb-4 text-4xl leading-snug font-bold border-b pl-1 pb-2 border-gray-400 dark:text-light-50 dark:border-portgore-200",
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
                "flex mt-4 mb-4 text-2xl leading-snug font-bold dark:text-light-100",
                props.className
            )}
        >
            {props.children}
        </h2>
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
        <h3
            {...props}
            className={cn("flex mt-2 mb-4 text-xl leading-snug dark:text-light-100", props.className)}
        >
            {props.children}
        </h3>
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
        <p
            {...props}
            className={cn("mb-4 text-base leading-relaxed dark:text-light-200", props.className)}
        />
    ),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
        <ul
            {...props}
            className={cn("mb-4 list-disc list-inside dark:text-light-50", props.className)}
        />
    ),
    ol: (props: ComponentPropsWithoutRef<"ol">) => (
        <ol
            {...props}
            className={cn("mb-4 list-decimal list-inside dark:text-light-50", props.className)}
        />
    ),
    hr: (props: ComponentPropsWithoutRef<"hr">) => (
        <hr {...props} className={cn("my-12 border-gray-300 dark:border-portgore-600", props.className)} />
    ),
    table: (props: ComponentPropsWithoutRef<"table">) => (
        <div className="overflow-auto">
            <table
                {...props}
                className={cn(
                    "items-center bg-transparent border-collapse my-4 table-auto",
                    props.className
                )}
            />
        </div>
    ),
    tr: (props: ComponentPropsWithoutRef<"tr">) => (
        <tr {...props} className={cn("group", props.className)} />
    ),
    th: (props: ComponentPropsWithoutRef<"th">) => (
        <th
            {...props}
            className={cn(
                "px-6 bg-gray-100 text-gray-700 dark:bg-portgore-700 dark:text-light-300 dark:border-portgore-500 align-middle border border-solid border-gray-200 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left",
                props.className
            )}
        />
    ),
    td: (props: ComponentPropsWithoutRef<"td">) => (
        <td
            {...props}
            className={cn(
                "border-t-0 bg-[#fcfcfd] group-hover:bg-[#f7f7f9] dark:bg-portgore-600 dark:text-light-100 dark:border-portgore-400 dark:group-hover:bg-portgore-500 border-b px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4",
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
                "pl-3 p-2 mx-2 my-2 bg-gray-100 mb-4 border-l-4 border-gray-400 rounded-r-lg dark:bg-portgore-800 dark:border-portgore-500",
                props.className
            )}
        />
    ),
};

const PostBody = ({ source }: Props) => {
    const MDXRenderer = React.useMemo(() => getMDXComponent(source), [source]);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="max-w-4xl px-4 -mx-2 md:mx-auto md:px-16 py-8 bg-[#fafafc] dark:bg-[#121120] markdown">
                <MDXRenderer components={components} />
            </div>
        </div>
    );
};

export default PostBody;
