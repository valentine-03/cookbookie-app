import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export const THEMES = [
  { id: 'garden', label: 'Garden original', description: 'The original CookBookie palette.' },
  { id: 'berry', label: 'Berry garden', description: 'A rosy variation with the same soft warmth.' },
  { id: 'coastal', label: 'Coastal morning', description: 'A cool, airy variation for a fresh start.' },
]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('cookbookie-theme') || 'garden')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('cookbookie-theme', theme)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}