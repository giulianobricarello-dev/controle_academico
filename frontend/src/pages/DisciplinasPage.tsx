import { useMemo, useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
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
import { indexById } from '../lib/lookups'
import { cursosService, disciplinasService } from '../services'
import type { Curso, Disciplina, Input as Payload } from '../types'

function DisciplinaForm({
  record,
  cursos,
  saving,
  error,
  submit,
  cancel,
}: {
  record: Disciplina | null
  cursos: ListState<Curso>
  saving: boolean
  error: string | null
  submit: (input: Payload<Disciplina>) => void
  cancel: () => void
}) {
  const form = useForm(
    {
      nome: record?.nome ?? '',
      cargaHoraria: record ? String(record.cargaHoraria) : '',
      cursoId: record ? String(record.cursoId) : '',
    },
    (v) => {
      const carga = Number(v.cargaHoraria)
      return {
        nome: v.nome.trim() ? undefined : 'Informe o nome da disciplina.',
        cargaHoraria: !v.cargaHoraria.trim()
          ? 'Informe a carga horária.'
          : !Number.isInteger(carga) || carga <= 0
            ? 'A carga horária deve ser um número inteiro maior que zero.'
            : undefined,
        cursoId: v.cursoId ? undefined : 'Selecione o curso da disciplina.',
      }
    },
  )
  const cursoSelect = relationState(cursos, 'cursos', '/cursos', 'Cursos')

  return (
    <FormShell
      onSubmit={form.handleSubmit((v) =>
        submit({ nome: v.nome.trim(), cargaHoraria: Number(v.cargaHoraria), cursoId: Number(v.cursoId) }),
      )}
      onCancel={cancel}
      saving={saving}
      error={error}
      submitLabel={record ? 'Salvar alterações' : 'Cadastrar disciplina'}
    >
      <Field label="Nome da disciplina" htmlFor="nome" required error={form.errors.nome}>
        <Input {...form.bind('nome')} autoFocus autoComplete="off" />
      </Field>
      <Field label="Carga horária (horas)" htmlFor="cargaHoraria" required error={form.errors.cargaHoraria}>
        <Input {...form.bind('cargaHoraria')} type="number" inputMode="numeric" min={1} step={1} />
      </Field>
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

export default function DisciplinasPage() {
  const crud = useCrud(disciplinasService, { singular: 'disciplina', feminine: true })
  const cursos = useList(cursosService.list)
  const query = useTopbarSearch('Buscar por disciplina ou curso')
  const [cursoFilter, setCursoFilter] = useState('')

  const cursoMap = useMemo(() => indexById(cursos.data), [cursos.data])
  const cursoNome = (id: number) => cursoMap.get(id)?.nome ?? (cursos.loading ? '…' : `Curso #${id}`)

  const rows = useMemo(
    () => crud.list.data.filter((d) => !cursoFilter || String(d.cursoId) === cursoFilter),
    [crud.list.data, cursoFilter],
  )

  const columns: Column<Disciplina>[] = [
    { key: 'id', header: 'ID', sortValue: (r) => r.id, render: (r) => r.id, className: 'w-20 tabular-nums text-muted' },
    { key: 'nome', header: 'Disciplina', sortValue: (r) => r.nome, render: (r) => <span className="font-medium">{r.nome}</span> },
    {
      key: 'carga',
      header: 'Carga horária',
      sortValue: (r) => r.cargaHoraria,
      render: (r) => <span className="tabular-nums">{r.cargaHoraria} h</span>,
    },
    { key: 'curso', header: 'Curso', sortValue: (r) => cursoNome(r.cursoId), render: (r) => cursoNome(r.cursoId), className: 'hidden md:table-cell' },
  ]

  return (
    <>
      <PageHeader
        description="Disciplinas de cada curso, com a respectiva carga horária."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={crud.openCreate}>
            Nova disciplina
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
          searchText={(r) => `${r.nome} ${cursoNome(r.cursoId)}`}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.askDelete}
          emptyIcon={BookOpen}
          emptyTitle="Nenhuma disciplina cadastrada"
          emptyDescription="Cadastre disciplinas para depois oferecê-las a cada semestre."
          emptyAction={<Button onClick={crud.openCreate}>Cadastrar disciplina</Button>}
          filtersActive={cursoFilter !== ''}
          onClearFilters={() => setCursoFilter('')}
          defaultSort={{ key: 'nome', dir: 'asc' }}
        />
      </div>
      <CrudDialogs
        crud={crud}
        renderForm={(record, ctx) => <DisciplinaForm key={record?.id ?? 'nova'} record={record} cursos={cursos} {...ctx} />}
        details={(r) => [
          { label: 'ID', value: r.id },
          { label: 'Disciplina', value: r.nome },
          { label: 'Carga horária', value: `${r.cargaHoraria} h` },
          { label: 'Curso', value: cursoNome(r.cursoId) },
        ]}
        deleteName={(r) => r.nome}
      />
    </>
  )
}
