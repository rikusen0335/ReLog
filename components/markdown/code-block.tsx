import React, { ComponentPropsWithoutRef, ReactNode, useRef, useState } from "react";
import cx from "classnames";

type Props = ComponentPropsWithoutRef<"pre"> &{
};

const CodeBlock = (props: Props) => {
    const textInput = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const onEnter = () => {
        setHovered(true);
    };

    const onLeave = () => {
        setHovered(false);
        setCopied(false);
    };

    const onCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(textInput.current.textContent);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="relative"
        >
            {hovered && <button className="absolute right-0 px-2 py-1 m-3 bg-gray-500 rounded dark:bg-portgore-600 text-light-100 dark:text-light-200 border-light-900" onClick={onCopy}>{copied ? "Copied!" : "Copy"}</button>}
            <pre ref={textInput} {...props} className={cx("!mt-0 !mb-4", props.className)} />
        </div>
    );
};

export default CodeBlock;
