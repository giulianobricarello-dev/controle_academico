import { useMemo } from 'react'
import { Library, Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { CrudDialogs } from '../components/ui/CrudDialogs'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Field, Input } from '../components/ui/Field'
import { FormShell } from '../components/ui/FormShell'
import { PageHeader } from '../components/ui/PageHeader'
import { useCrud } from '../hooks/useCrud'
import { useForm } from '../hooks/useForm'
import { useTopbarSearch } from '../hooks/useTopbarSearch'
import { cursosService } from '../services'
import type { Curso, Input as Payload } from '../types'

function CursoForm({
  record,
  saving,
  error,
  submit,
  cancel,
}: {
  record: Curso | null
  saving: boolean
  error: string | null
  submit: (input: Payload<Curso>) => void
  cancel: () => void
}) {
  const form = useForm({ nome: record?.nome ?? '' }, (v) => ({
    nome: v.nome.trim() ? undefined : 'Informe o nome do curso.',
  }))

  return (
    <FormShell
      onSubmit={form.handleSubmit((v) => submit({ nome: v.nome.trim() }))}
      onCancel={cancel}
      saving={saving}
      error={error}
      submitLabel={record ? 'Salvar alterações' : 'Cadastrar curso'}
    >
      <Field label="Nome do curso" htmlFor="nome" required error={form.errors.nome}>
        <Input {...form.bind('nome')} autoFocus autoComplete="off" />
      </Field>
    </FormShell>
  )
}

export default function CursosPage() {
  const crud = useCrud(cursosService, { singular: 'curso' })
  const query = useTopbarSearch('Buscar curso pelo nome')

  const columns = useMemo<Column<Curso>[]>(
    () => [
      { key: 'id', header: 'ID', sortValue: (r) => r.id, render: (r) => r.id, className: 'w-20 tabular-nums text-muted' },
      { key: 'nome', header: 'Nome do curso', sortValue: (r) => r.nome, render: (r) => <span className="font-medium">{r.nome}</span> },
    ],
    [],
  )

  return (
    <>
      <PageHeader
        description="Cursos oferecidos pela instituição. Alunos e disciplinas são vinculados a um curso."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={crud.openCreate}>
            Novo curso
          </Button>
        }
      />
      <div className="rounded-xl border border-line bg-surface shadow-card">
        <DataTable
          columns={columns}
          rows={crud.list.data}
          rowKey={(r) => r.id}
          loading={crud.list.loading}
          error={crud.list.error}
          onRetry={() => void crud.list.reload()}
          query={query}
          searchText={(r) => r.nome}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.askDelete}
          emptyIcon={Library}
          emptyTitle="Nenhum curso cadastrado"
          emptyDescription="Cadastre o primeiro curso para começar a vincular alunos e disciplinas."
          emptyAction={<Button onClick={crud.openCreate}>Cadastrar curso</Button>}
          defaultSort={{ key: 'nome', dir: 'asc' }}
        />
      </div>
      <CrudDialogs
        crud={crud}
        size="sm"
        renderForm={(record, ctx) => <CursoForm key={record?.id ?? 'novo'} record={record} {...ctx} />}
        details={(r) => [
          { label: 'ID', value: r.id },
          { label: 'Nome do curso', value: r.nome },
        ]}
        deleteName={(r) => r.nome}
      />
    </>
  )
}
