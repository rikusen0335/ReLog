import { useSimpleDarkMode } from './useSimpleDarkMode'
import { useEffect } from 'react'
import { useLocalStorage } from 'react-use'

// Reference: https://zenn.dev/panda_program/articles/tailwindcss-darkmode

const Theme = {
    Dark: 'dark',
    Light: 'light',
} as const

type UseDarkMode = () => {
    isDarkMode: boolean
    toggle: (isDark: boolean) => void
}

export const useDarkMode: UseDarkMode = () => {
    const { isDarkMode, toggle } = useSimpleDarkMode()
    const setValue = (value: string) => localStorage.setItem('theme', value)

    const persistToggle = (isDark: boolean) => {
        toggle(isDark)
        setValue(isDark ? Theme.Dark : Theme.Light)
    }

    useEffect(() => {
        if (
            localStorage.getItem('theme') === Theme.Dark ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            toggle(true)
            setValue("dark")
        } else {
            toggle(false)
            setValue("light")
        }
    }, [setValue, toggle])

    return { isDarkMode, toggle: persistToggle }
}
