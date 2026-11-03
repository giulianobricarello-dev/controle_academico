import { useCallback, useState } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = useCallback(() => {
    setDark((current) => {
      const next = !current
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch {
        /* armazenamento indisponível: o tema vale só para esta sessão */
      }
      return next
    })
  }, [])

  return { dark, toggle }
}
