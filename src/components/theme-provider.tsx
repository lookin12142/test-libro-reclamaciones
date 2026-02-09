import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

const ThemeContext = React.createContext<{
  theme: string
  setTheme: (theme: string) => void
}>({ theme: 'light', setTheme: () => {} })

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light',
  storageKey = 'theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props 
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(defaultTheme)

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey)
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem(storageKey, theme)
    if (attribute === 'class') {
      document.documentElement.className = theme
    } else {
      document.documentElement.setAttribute(attribute, theme)
    }
  }, [theme, storageKey, attribute])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
