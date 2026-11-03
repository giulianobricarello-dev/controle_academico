import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface SearchContextValue {
  query: string
  placeholder: string | null
  setQuery: (value: string) => void
  setPlaceholder: (value: string | null) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [placeholder, setPlaceholder] = useState<string | null>(null)
  return (
    <SearchContext.Provider value={{ query, placeholder, setQuery, setPlaceholder }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchState() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearchState deve ser usado dentro de <SearchProvider>')
  return ctx
}

/** Ativa o campo de pesquisa da barra superior para a página atual e devolve o texto digitado. */
export function useTopbarSearch(placeholder: string): string {
  const { query, setQuery, setPlaceholder } = useSearchState()
  useEffect(() => {
    setPlaceholder(placeholder)
    return () => {
      setPlaceholder(null)
      setQuery('')
    }
  }, [placeholder, setPlaceholder, setQuery])
  return query
}
