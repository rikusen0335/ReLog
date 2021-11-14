import React, { useEffect, useState } from "react"
import { useDarkMode } from "../hooks/useDarkMode"
import MoonIcon from "./moon-icon"
import SunIcon from "./sun-icon"

// Reference: https://www.vidyasource.com/blog/dark-mode-nextjs-tailwindcss-react-hooks

export const ThemeButton = () => {
    const { isDarkMode, toggle } = useDarkMode()

    const toggleTheme = () => toggle(!isDarkMode)

    return (
        <div onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#aaaaaa20] dark:hover:bg-[#ffffff20] dark:text-light-200 delay-[15ms] duration-150 ease-in-out cursor-pointer">
            {isDarkMode ? (
                <MoonIcon />
            ) : (
                <SunIcon />
            )}
        </div>
    )
}
