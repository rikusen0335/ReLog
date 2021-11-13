import { useCallback, useEffect, useState } from 'react'

// Reference: https://zenn.dev/panda_program/articles/tailwindcss-darkmode

type UseSimpleDarkMode = (isDark?: boolean) => {
    isDarkMode: boolean
    toggle: (isDark?: boolean) => void
}

// dark mode と light mode を切り替える
export const useSimpleDarkMode: UseSimpleDarkMode = (isInitialDark = false) => {
    const [isDarkMode, toggleTheme] = useState<boolean>(isInitialDark)
    const toggle = useCallback((isDark?) => {
        if (typeof isDark === 'undefined') {
            toggleTheme((state) => !state)
            return
        }

        toggleTheme(isDark)
    }, [])

    useEffect(() => {
        if (isDarkMode) {
            window.document.documentElement.classList.add('dark')
        } else {
            window.document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    return { isDarkMode, toggle }
}
