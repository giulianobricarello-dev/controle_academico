import type { ReactNode } from 'react'
import type { Crud } from '../../hooks/useCrud'
import { Button } from './Button'
import { ConfirmDialog } from './ConfirmDialog'
import { DetailList, type DetailItem } from './DetailList'
import { Modal } from './Modal'
import { Skeleton } from './Skeleton'

export interface FormContext<I> {
  saving: boolean
  error: string | null
  submit: (input: I) => void
  cancel: () => void
}

interface CrudDialogsProps<T extends { id: number }, I> {
  crud: Crud<T, I>
  renderForm: (record: T | null, ctx: FormContext<I>) => ReactNode
  details: (record: T) => DetailItem[]
  /** Nome do registro exibido na confirmação de exclusão. */
  deleteName: (record: T) => string
  size?: 'sm' | 'md' | 'lg'
}

/** Modais de cadastro, edição, visualização e confirmação de exclusão de um CRUD. */
export function CrudDialogs<T extends { id: number }, I>({
  crud,
  renderForm,
  details,
  deleteName,
  size = 'md',
}: CrudDialogsProps<T, I>) {
  const { singular, feminine } = crud.labels
  const { modal } = crud

  const title =
    modal?.mode === 'create'
      ? `${feminine ? 'Nova' : 'Novo'} ${singular}`
      : modal?.mode === 'edit'
        ? `Editar ${singular}`
        : `Detalhes d${feminine ? 'a' : 'o'} ${singular}`

  return (
    <>
      <Modal open={!!modal} title={title} onClose={crud.close} size={size} dismissible={!crud.saving}>
        {modal?.loading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Carregando registro">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        ) : modal?.mode === 'view' && modal.record ? (
          <>
            <DetailList items={details(modal.record)} />
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={crud.close}>
                Fechar
              </Button>
              <Button onClick={() => void crud.openEdit(modal.record as T)}>Editar</Button>
            </div>
          </>
        ) : modal ? (
          renderForm(modal.record, {
            saving: crud.saving,
            error: crud.formError,
            submit: (input) => void crud.save(input),
            cancel: crud.close,
          })
        ) : null}
      </Modal>

      <ConfirmDialog
        open={!!crud.toDelete}
        title={`Excluir ${singular}?`}
        loading={crud.deleting}
        onConfirm={() => void crud.confirmDelete()}
        onCancel={crud.cancelDelete}
      >
        {crud.toDelete && (
          <>
            Você está prestes a excluir {feminine ? 'a' : 'o'} {singular}{' '}
            <strong className="text-ink">“{deleteName(crud.toDelete)}”</strong>. Esta ação não pode ser desfeita.
          </>
        )}
      </ConfirmDialog>
    </>
  )
}
