import { useState, useCallback } from 'react'

/**
 * Generic hook for API calls with loading/error state
 */
export function useApi(apiFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await apiFn(...args)
      setData(result)
      return result
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Erro desconhecido'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}
