import axios from 'axios'
import { API_URL } from './api'

export type ErrorContext = 'list' | 'get' | 'save' | 'delete'

function asText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() && !value.trim().startsWith('<') ? value.trim() : null
}

/** Extrai a melhor mensagem possível do corpo de erro do Spring (várias formas possíveis). */
function extractApiMessage(data: unknown): string | null {
  const direct = asText(data)
  if (direct) return direct
  if (!data || typeof data !== 'object') return null

  const body = data as Record<string, unknown>

  if (Array.isArray(body.errors)) {
    const messages = body.errors
      .map((e) => {
        if (typeof e === 'string') return e
        if (e && typeof e === 'object') {
          const item = e as Record<string, unknown>
          return asText(item.defaultMessage) ?? asText(item.message)
        }
        return null
      })
      .filter((m): m is string => !!m)
    if (messages.length) return Array.from(new Set(messages)).join('; ')
  }

  const message = asText(body.message)
  if (message && message !== 'No message available') return message
  return asText(body.detail)
}

function fallbackMessage(status: number, context: ErrorContext): string {
  switch (status) {
    case 400:
      return 'Dados inválidos. Revise os campos informados.'
    case 404:
      return 'Registro não encontrado. Ele pode ter sido removido por outra pessoa.'
    case 409:
      return context === 'delete'
        ? 'Não foi possível excluir: existem registros vinculados a este item.'
        : 'Registro duplicado ou conflito com uma regra de negócio.'
    case 500:
      return context === 'delete'
        ? 'Falha interna ao excluir. Verifique se existem registros vinculados a este item.'
        : 'Falha interna no servidor. Tente novamente em instantes.'
    default:
      return `A API respondeu com erro ${status}.`
  }
}

export function getStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}

export function getErrorMessage(error: unknown, context: ErrorContext = 'list'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return error.code === 'ECONNABORTED'
        ? 'A API demorou demais para responder. Tente novamente.'
        : `Não foi possível conectar à API (${API_URL}). Verifique se o servidor está em execução e se o CORS permite este endereço.`
    }
    return extractApiMessage(error.response.data) ?? fallbackMessage(error.response.status, context)
  }
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
}
