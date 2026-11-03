import { useMemo, useState } from 'react'
import { GraduationCap, Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { CrudDialogs } from '../components/ui/CrudDialogs'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Field, Input, Select, relationState } from '../components/ui/Field'
import { FilterSelect } from '../components/ui/FilterSelect'
import { FormShell } from '../components/ui/FormShell'
import { PageHeader } from '../components/ui/PageHeader'
import { useCrud } from '../hooks/useCrud'
import { useForm } from '../hooks/useForm'
import { useList, type ListState } from '../hooks/useList'
import { useTopbarSearch } from '../hooks/useTopbarSearch'
import { isEmail } from '../lib/format'
import { indexById } from '../lib/lookups'
import { alunosService, cursosService } from '../services'
import type { Aluno, Curso, Input as Payload } from '../types'

function AlunoForm({
  record,
  cursos,
  saving,
  error,
  submit,
  cancel,
}: {
  record: Aluno | null
  cursos: ListState<Curso>
  saving: boolean
  error: string | null
  submit: (input: Payload<Aluno>) => void
  cancel: () => void
}) {
  const form = useForm(
    {
      nome: record?.nome ?? '',
      email: record?.email ?? '',
      cursoId: record ? String(record.cursoId) : '',
    },
    (v) => ({
      nome: v.nome.trim() ? undefined : 'Informe o nome do aluno.',
      email: !v.email.trim() ? 'Informe o e-mail.' : isEmail(v.email.trim()) ? undefined : 'Informe um e-mail válido.',
      cursoId: v.cursoId ? undefined : 'Selecione o curso do aluno.',
    }),
  )
  const cursoSelect = relationState(cursos, 'cursos', '/cursos', 'Cursos')

  return (
    <FormShell
      onSubmit={form.handleSubmit((v) =>
        submit({
          nome: v.nome.trim(),
          email: v.email.trim(),
          cursoId: Number(v.cursoId),
        }),
      )}
      onCancel={cancel}
      saving={saving}
      error={error}
      submitLabel={record ? 'Salvar alterações' : 'Cadastrar aluno'}
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
      <Field label="Curso" htmlFor="cursoId" required error={form.errors.cursoId} hint={cursoSelect.hint}>
        <Select
          {...form.bind('cursoId')}
          placeholder={cursoSelect.placeholder}
          disabled={cursoSelect.disabled}
          options={cursos.data.map((c) => ({ value: String(c.id), label: c.nome }))}
        />
      </Field>
    </FormShell>
  )
}

export default function AlunosPage() {
  const crud = useCrud(alunosService, { singular: 'aluno' })
  const cursos = useList(cursosService.list)
  const query = useTopbarSearch('Buscar por nome, e-mail ou matrícula')
  const [cursoFilter, setCursoFilter] = useState('')

  const cursoMap = useMemo(() => indexById(cursos.data), [cursos.data])
  const cursoNome = (id: number) => cursoMap.get(id)?.nome ?? (cursos.loading ? '…' : `Curso #${id}`)

  const rows = useMemo(
    () => crud.list.data.filter((a) => !cursoFilter || String(a.cursoId) === cursoFilter),
    [crud.list.data, cursoFilter],
  )

  const columns: Column<Aluno>[] = [
    { key: 'id', header: 'ID', sortValue: (r) => r.id, render: (r) => r.id, className: 'w-20 tabular-nums text-muted' },
    { key: 'nome', header: 'Nome', sortValue: (r) => r.nome, render: (r) => <span className="font-medium">{r.nome}</span> },
    { key: 'email', header: 'E-mail', sortValue: (r) => r.email, render: (r) => r.email, className: 'hidden lg:table-cell' },
    {
      key: 'matricula',
      header: 'Matrícula',
      sortValue: (r) => r.matriculaInstitucional,
      render: (r) => <span className="tabular-nums">{r.matriculaInstitucional}</span>,
    },
    { key: 'curso', header: 'Curso', sortValue: (r) => cursoNome(r.cursoId), render: (r) => cursoNome(r.cursoId), className: 'hidden md:table-cell' },
  ]

  return (
    <>
      <PageHeader
        description="Estudantes cadastrados e o curso ao qual cada um está vinculado."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={crud.openCreate}>
            Novo aluno
          </Button>
        }
      />
      <div className="rounded-xl border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <FilterSelect
            label="curso"
            allLabel="Todos os cursos"
            value={cursoFilter}
            onChange={setCursoFilter}
            disabled={cursos.loading || cursos.data.length === 0}
            options={cursos.data.map((c) => ({ value: String(c.id), label: c.nome }))}
          />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          loading={crud.list.loading}
          error={crud.list.error}
          onRetry={() => void crud.list.reload()}
          query={query}
          searchText={(r) => `${r.nome} ${r.email} ${r.matriculaInstitucional}`}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.askDelete}
          emptyIcon={GraduationCap}
          emptyTitle="Nenhum aluno cadastrado"
          emptyDescription="Cadastre o primeiro aluno e vincule-o a um curso."
          emptyAction={<Button onClick={crud.openCreate}>Cadastrar aluno</Button>}
          filtersActive={cursoFilter !== ''}
          onClearFilters={() => setCursoFilter('')}
          defaultSort={{ key: 'nome', dir: 'asc' }}
        />
      </div>
      <CrudDialogs
        crud={crud}
        renderForm={(record, ctx) => <AlunoForm key={record?.id ?? 'novo'} record={record} cursos={cursos} {...ctx} />}
        details={(r) => [
          { label: 'ID', value: r.id },
          { label: 'Nome', value: r.nome },
          { label: 'E-mail', value: r.email },
          { label: 'Matrícula institucional', value: r.matriculaInstitucional },
          { label: 'Curso', value: cursoNome(r.cursoId) },
        ]}
        deleteName={(r) => r.nome}
      />
    </>
  )
}
