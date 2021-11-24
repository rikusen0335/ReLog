import React, {
    ComponentPropsWithoutRef,
    ReactNode,
    useRef,
    useState,
} from "react";
import cx from "classnames";

export type TipsProps = {
    type?: "info" | "warn" | "error";
    children: ReactNode;
};

const Tips = ({ children, type }: TipsProps) => {
    return (
        <div className="tips flex items-center border-blue-400 bg-blue-200 dark:bg-blue-900 dark:border-blue-600 px-4 py-4 border-l-[3px] rounded-r text-gray-800 dark:text-light-200">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            {children}
        </div>
    );
};

export default Tips;
