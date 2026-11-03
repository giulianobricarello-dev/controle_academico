import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getErrorMessage, getStatus, type CrudService } from '../services'
import { useToast } from '../components/ui/Toast'
import { useList } from './useList'

type Mode = 'create' | 'edit' | 'view'

interface ModalState<T> {
  mode: Mode
  record: T | null
  loading: boolean
}

interface Labels {
  /** Nome do recurso no singular, em minúsculas (ex.: "aluno"). */
  singular: string
  /** Gênero feminino (ex.: "disciplina") para concordar "cadastrada/excluída". */
  feminine?: boolean
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * Concentra o ciclo de um CRUD: listagem, modal de criar/editar/visualizar,
 * exclusão com confirmação, avisos (toast) e recarga automática da lista.
 */
export function useCrud<T extends { id: number }, I>(service: CrudService<T, I>, labels: Labels) {
  const toast = useToast()
  const list = useList<T>(service.list)
  const [modal, setModal] = useState<ModalState<T> | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<T | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [params, setParams] = useSearchParams()

  const noun = capitalize(labels.singular)
  const f = labels.feminine

  const openCreate = useCallback(() => {
    setFormError(null)
    setModal({ mode: 'create', record: null, loading: false })
  }, [])

  // Atalho do Dashboard: /rota?novo=1 abre o cadastro direto.
  useEffect(() => {
    if (params.get('novo') !== null) {
      openCreate()
      setParams({}, { replace: true })
    }
  }, [params, setParams, openCreate])

  /** Abre visualização/edição buscando o registro atualizado em GET /recurso/{id}. */
  const openRecord = async (mode: 'view' | 'edit', row: T) => {
    setFormError(null)
    setModal({ mode, record: row, loading: true })
    try {
      const fresh = await service.get(row.id)
      setModal((m) => (m && m.record?.id === row.id ? { mode: m.mode, record: fresh, loading: false } : m))
    } catch (e) {
      setModal(null)
      toast.error(getErrorMessage(e, 'get'))
      if (getStatus(e) === 404) void list.reload()
    }
  }

  const close = () => {
    if (!saving) setModal(null)
  }

  const save = async (input: I) => {
    setSaving(true)
    setFormError(null)
    try {
      if (modal?.mode === 'edit' && modal.record) {
        await service.update(modal.record.id, input)
        toast.success(`${noun} ${f ? 'atualizada' : 'atualizado'} com sucesso.`)
      } else {
        await service.create(input)
        toast.success(`${noun} ${f ? 'cadastrada' : 'cadastrado'} com sucesso.`)
      }
      setModal(null)
      await list.reload()
    } catch (e) {
      setFormError(getErrorMessage(e, 'save'))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await service.remove(toDelete.id)
      toast.success(`${noun} ${f ? 'excluída' : 'excluído'} com sucesso.`)
      setToDelete(null)
      await list.reload()
    } catch (e) {
      toast.error(getErrorMessage(e, 'delete'))
      setToDelete(null)
      if (getStatus(e) === 404) void list.reload()
    } finally {
      setDeleting(false)
    }
  }

  return {
    list,
    labels,
    modal,
    saving,
    formError,
    toDelete,
    deleting,
    openCreate,
    openView: (row: T) => openRecord('view', row),
    openEdit: (row: T) => openRecord('edit', row),
    close,
    save,
    askDelete: (row: T) => setToDelete(row),
    cancelDelete: () => !deleting && setToDelete(null),
    confirmDelete,
  }
}

export type Crud<T extends { id: number }, I> = ReturnType<typeof useCrud<T, I>>
