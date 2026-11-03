import axios from 'axios'

/** URL base da API. Configure em .env com VITE_API_URL (padrão: http://localhost:8080). */
export const API_URL: string =
  (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '') || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})
