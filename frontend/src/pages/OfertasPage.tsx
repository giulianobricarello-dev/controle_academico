import { useMemo, useState } from 'react'
import { CalendarRange, Plus } from 'lucide-react'
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
import { SEMESTRE_REGEX } from '../lib/format'
import { indexById } from '../lib/lookups'
import { disciplinasService, ofertasService, professoresService } from '../services'
import type { Disciplina, Input as Payload, OfertaDisciplina, Professor } from '../types'

function OfertaForm({
  record,
  disciplinas,
  professores,
  saving,
  error,
  submit,
  cancel,
}: {
  record: OfertaDisciplina | null
  disciplinas: ListState<Disciplina>
  professores: ListState<Professor>
  saving: boolean
  error: string | null
  submit: (input: Payload<OfertaDisciplina>) => void
  cancel: () => void
}) {
  const form = useForm(
    {
      disciplinaId: record ? String(record.disciplinaId) : '',
      professorId: record ? String(record.professorId) : '',
      semestre: record?.semestre ?? '',
    },
    (v) => ({
      disciplinaId: v.disciplinaId ? undefined : 'Selecione a disciplina.',
      professorId: v.professorId ? undefined : 'Selecione o professor.',
      semestre: !v.semestre.trim()
        ? 'Informe o semestre.'
        : SEMESTRE_REGEX.test(v.semestre.trim())
          ? undefined
          : 'Use o formato AAAA.1 ou AAAA.2 (ex.: 2026.2).',
    }),
  )
  const disciplinaSelect = relationState(disciplinas, 'disciplinas', '/disciplinas', 'Disciplinas')
  const professorSelect = relationState(professores, 'professores', '/professores', 'Professores')

  return (
    <FormShell
      onSubmit={form.handleSubmit((v) =>
        submit({
          disciplinaId: Number(v.disciplinaId),
          professorId: Number(v.professorId),
          semestre: v.semestre.trim(),
        }),
      )}
      onCancel={cancel}
      saving={saving}
      error={error}
      submitLabel={record ? 'Salvar alterações' : 'Criar oferta'}
    >
      <Field label="Disciplina" htmlFor="disciplinaId" required error={form.errors.disciplinaId} hint={disciplinaSelect.hint}>
        <Select
          {...form.bind('disciplinaId')}
          autoFocus
          placeholder={disciplinaSelect.placeholder}
          disabled={disciplinaSelect.disabled}
          options={disciplinas.data.map((d) => ({ value: String(d.id), label: d.nome }))}
        />
      </Field>
      <Field label="Professor" htmlFor="professorId" required error={form.errors.professorId} hint={professorSelect.hint}>
        <Select
          {...form.bind('professorId')}
          placeholder={professorSelect.placeholder}
          disabled={professorSelect.disabled}
          options={professores.data.map((p) => ({ value: String(p.id), label: p.nome }))}
        />
      </Field>
      <Field label="Semestre" htmlFor="semestre" required error={form.errors.semestre} hint="Formato AAAA.1 ou AAAA.2, por exemplo 2026.2.">
        <Input {...form.bind('semestre')} placeholder="2026.2" maxLength={6} autoComplete="off" />
      </Field>
    </FormShell>
  )
}

export default function OfertasPage() {
  const crud = useCrud(ofertasService, { singular: 'oferta', feminine: true })
  const disciplinas = useList(disciplinasService.list)
  const professores = useList(professoresService.list)
  const query = useTopbarSearch('Buscar por disciplina, professor ou semestre')
  const [semestre, setSemestre] = useState('')
  const [disciplinaId, setDisciplinaId] = useState('')
  const [professorId, setProfessorId] = useState('')

  const disciplinaMap = useMemo(() => indexById(disciplinas.data), [disciplinas.data])
  const professorMap = useMemo(() => indexById(professores.data), [professores.data])
  const disciplinaNome = (id: number) => disciplinaMap.get(id)?.nome ?? (disciplinas.loading ? '…' : `Disciplina #${id}`)
  const professorNome = (id: number) => professorMap.get(id)?.nome ?? (professores.loading ? '…' : `Professor #${id}`)

  const semestres = useMemo(
    () => Array.from(new Set(crud.list.data.map((o) => o.semestre))).sort().reverse(),
    [crud.list.data],
  )

  const rows = useMemo(
    () =>
      crud.list.data.filter(
        (o) =>
          (!semestre || o.semestre === semestre) &&
          (!disciplinaId || String(o.disciplinaId) === disciplinaId) &&
          (!professorId || String(o.professorId) === professorId),
      ),
    [crud.list.data, semestre, disciplinaId, professorId],
  )

  const clearFilters = () => {
    setSemestre('')
    setDisciplinaId('')
    setProfessorId('')
  }

  const columns: Column<OfertaDisciplina>[] = [
    { key: 'id', header: 'ID', sortValue: (r) => r.id, render: (r) => r.id, className: 'w-20 tabular-nums text-muted' },
    {
      key: 'disciplina',
      header: 'Disciplina',
      sortValue: (r) => disciplinaNome(r.disciplinaId),
      render: (r) => <span className="font-medium">{disciplinaNome(r.disciplinaId)}</span>,
    },
    { key: 'professor', header: 'Professor', sortValue: (r) => professorNome(r.professorId), render: (r) => professorNome(r.professorId) },
    { key: 'semestre', header: 'Semestre', sortValue: (r) => r.semestre, render: (r) => <span className="tabular-nums">{r.semestre}</span> },
  ]

  return (
    <>
      <PageHeader
        description="Disciplinas oferecidas por um professor em determinado semestre. É nelas que os alunos se matriculam."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={crud.openCreate}>
            Nova oferta
          </Button>
        }
      />
      <div className="rounded-xl border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <FilterSelect
            label="semestre"
            allLabel="Todos os semestres"
            value={semestre}
            onChange={setSemestre}
            disabled={semestres.length === 0}
            options={semestres.map((s) => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="disciplina"
            allLabel="Todas as disciplinas"
            value={disciplinaId}
            onChange={setDisciplinaId}
            disabled={disciplinas.data.length === 0}
            options={disciplinas.data.map((d) => ({ value: String(d.id), label: d.nome }))}
          />
          <FilterSelect
            label="professor"
            allLabel="Todos os professores"
            value={professorId}
            onChange={setProfessorId}
            disabled={professores.data.length === 0}
            options={professores.data.map((p) => ({ value: String(p.id), label: p.nome }))}
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
          searchText={(r) => `${disciplinaNome(r.disciplinaId)} ${professorNome(r.professorId)} ${r.semestre}`}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.askDelete}
          emptyIcon={CalendarRange}
          emptyTitle="Nenhuma oferta cadastrada"
          emptyDescription="Associe uma disciplina a um professor em um semestre para abrir matrículas."
          emptyAction={<Button onClick={crud.openCreate}>Criar oferta</Button>}
          filtersActive={!!(semestre || disciplinaId || professorId)}
          onClearFilters={clearFilters}
          defaultSort={{ key: 'semestre', dir: 'desc' }}
        />
      </div>
      <CrudDialogs
        crud={crud}
        renderForm={(record, ctx) => (
          <OfertaForm key={record?.id ?? 'nova'} record={record} disciplinas={disciplinas} professores={professores} {...ctx} />
        )}
        details={(r) => [
          { label: 'ID', value: r.id },
          { label: 'Disciplina', value: disciplinaNome(r.disciplinaId) },
          { label: 'Professor', value: professorNome(r.professorId) },
          { label: 'Semestre', value: r.semestre },
        ]}
        deleteName={(r) => `${disciplinaNome(r.disciplinaId)} (${r.semestre})`}
      />
    </>
  )
}
