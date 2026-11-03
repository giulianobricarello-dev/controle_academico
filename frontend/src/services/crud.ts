import { api } from './api'
import type { Input } from '../types'

export interface CrudService<T, I = Input<T>> {
  list: () => Promise<T[]>
  get: (id: number) => Promise<T>
  create: (payload: I) => Promise<T>
  update: (id: number, payload: I) => Promise<T>
  remove: (id: number) => Promise<void>
}

/** Cria o conjunto padrão de chamadas REST para um recurso (GET/POST/PUT/DELETE). */
export function createCrudService<T extends { id: number }>(path: string): CrudService<T> {
  return {
    list: async () => (await api.get<T[]>(path)).data,
    get: async (id) => (await api.get<T>(`${path}/${id}`)).data,
    create: async (payload) => (await api.post<T>(path, payload)).data,
    update: async (id, payload) => (await api.put<T>(`${path}/${id}`, payload)).data,
    remove: async (id) => {
      await api.delete(`${path}/${id}`)
    },
  }
}
