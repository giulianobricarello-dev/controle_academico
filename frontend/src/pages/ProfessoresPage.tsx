import { useMemo } from 'react'
import { Plus, Presentation } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { CrudDialogs } from '../components/ui/CrudDialogs'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Field, Input } from '../components/ui/Field'
import { FormShell } from '../components/ui/FormShell'
import { PageHeader } from '../components/ui/PageHeader'
import { useCrud } from '../hooks/useCrud'
import { useForm } from '../hooks/useForm'
import { useTopbarSearch } from '../hooks/useTopbarSearch'
import { isEmail } from '../lib/format'
import { professoresService } from '../services'
import type { Input as Payload, Professor } from '../types'

function ProfessorForm({
  record,
  saving,
  error,
  submit,
  cancel,
}: {
  record: Professor | null
  saving: boolean
  error: string | null
  submit: (input: Payload<Professor>) => void
  cancel: () => void
}) {
  const form = useForm(
    {
      nome: record?.nome ?? '',
      email: record?.email ?? '',
    },
    (v) => ({
      nome: v.nome.trim() ? undefined : 'Informe o nome do professor.',
      email: !v.email.trim() ? 'Informe o e-mail.' : isEmail(v.email.trim()) ? undefined : 'Informe um e-mail válido.',
    }),
  )

  return (
    <FormShell
      onSubmit={form.handleSubmit((v) =>
        submit({
          nome: v.nome.trim(),
          email: v.email.trim(),
        }),
      )}
      onCancel={cancel}
      saving={saving}
      error={error}
      submitLabel={record ? 'Salvar alterações' : 'Cadastrar professor'}
    >
      <Field label="Nome" htmlFor="nome" required error={form.errors.nome}>
        <Input {...form.bind('nome')} autoFocus autoComplete="off" />
      </Field>
      <Field label="E-mail" htmlFor="email" required error={form.errors.email}>
        <Input {...form.bind('email')} type="email" autoComplete="off" />
      </Field>
      <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted">
        Matrícula institucional: {record?.matriculaInstitucional ?? 'gerada automaticamente após o cadastro'}
      </div>
    </FormShell>
  )
}

export default function ProfessoresPage() {
  const crud = useCrud(professoresService, { singular: 'professor' })
  const query = useTopbarSearch('Buscar por nome, e-mail ou matrícula')

  const columns = useMemo<Column<Professor>[]>(
    () => [
      { key: 'id', header: 'ID', sortValue: (r) => r.id, render: (r) => r.id, className: 'w-20 tabular-nums text-muted' },
      { key: 'nome', header: 'Nome', sortValue: (r) => r.nome, render: (r) => <span className="font-medium">{r.nome}</span> },
      { key: 'email', header: 'E-mail', sortValue: (r) => r.email, render: (r) => r.email, className: 'hidden md:table-cell' },
      {
        key: 'matricula',
        header: 'Matrícula institucional',
        sortValue: (r) => r.matriculaInstitucional,
        render: (r) => <span className="tabular-nums">{r.matriculaInstitucional}</span>,
      },
    ],
    [],
  )

  return (
    <>
      <PageHeader
        description="Professores responsáveis pelas ofertas de disciplinas."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={crud.openCreate}>
            Novo professor
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
          searchText={(r) => `${r.nome} ${r.email} ${r.matriculaInstitucional}`}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.askDelete}
          emptyIcon={Presentation}
          emptyTitle="Nenhum professor cadastrado"
          emptyDescription="Cadastre professores para poder criar ofertas de disciplinas."
          emptyAction={<Button onClick={crud.openCreate}>Cadastrar professor</Button>}
          defaultSort={{ key: 'nome', dir: 'asc' }}
        />
      </div>
      <CrudDialogs
        crud={crud}
        renderForm={(record, ctx) => <ProfessorForm key={record?.id ?? 'novo'} record={record} {...ctx} />}
        details={(r) => [
          { label: 'ID', value: r.id },
          { label: 'Nome', value: r.nome },
          { label: 'E-mail', value: r.email },
          { label: 'Matrícula institucional', value: r.matriculaInstitucional },
        ]}
        deleteName={(r) => r.nome}
      />
    </>
  )
}
