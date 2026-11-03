import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../services'

export interface ListState<T> {
  data: T[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

/** Carrega uma lista da API e expõe estados de carregamento, erro e recarga. */
export function useList<T>(fetcher: () => Promise<T[]>): ListState<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const requestId = useRef(0)

  const reload = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      if (id === requestId.current) setData(result)
    } catch (e) {
      if (id === requestId.current) {
        setData([])
        setError(getErrorMessage(e, 'list'))
      }
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { data, loading, error, reload }
}
