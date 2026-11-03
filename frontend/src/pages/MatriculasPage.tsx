import { useMemo, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
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
import { formatDate, formatNota, todayISO } from '../lib/format'
import { indexById, ofertaLabel } from '../lib/lookups'
import { alunosService, disciplinasService, matriculasService, ofertasService, professoresService } from '../services'
import type { Aluno, Disciplina, Input as Payload, Matricula, OfertaDisciplina, Professor } from '../types'

interface FormProps {
  record: Matricula | null
  matriculas: Matricula[]
  alunos: ListState<Aluno>
  ofertas: ListState<OfertaDisciplina>
  disciplinaMap: Map<number, Disciplina>
  professorMap: Map<number, Professor>
  saving: boolean
  error: string | null
  submit: (input: Payload<Matricula>) => void
  cancel: () => void
}

function MatriculaForm({
  record,
  matriculas,
  alunos,
  ofertas,
  disciplinaMap,
  professorMap,
  saving,
  error,
  submit,
  cancel,
}: FormProps) {
  /** Ofertas em que o aluno informado já está matriculado (ignora o próprio registro em edição). */
  const takenBy = (alunoId: string) =>
    new Set(
      matriculas
        .filter((m) => m.id !== record?.id && String(m.alunoId) === alunoId)
        .map((m) => m.ofertaDisciplinaId),
    )

  const form = useForm(
    {
      alunoId: record ? String(record.alunoId) : '',
      ofertaDisciplinaId: record ? String(record.ofertaDisciplinaId) : '',
      notaFinal: record?.notaFinal != null ? String(record.notaFinal) : '',
      situacao: record?.situacao ?? 'CURSANDO',
      dataMatricula: record?.dataMatricula ?? todayISO(),
    },
    (v) => {
      const nota = Number(v.notaFinal.replace(',', '.'))
      return {
        alunoId: v.alunoId ? undefined : 'Selecione o aluno.',
        ofertaDisciplinaId: !v.ofertaDisciplinaId
          ? 'Selecione a oferta de disciplina.'
          : v.alunoId && takenBy(v.alunoId).has(Number(v.ofertaDisciplinaId))
            ? 'Este aluno já está matriculado nesta oferta.'
            : undefined,
        notaFinal: v.notaFinal.trim() && (!Number.isFinite(nota) || nota < 0 || nota > 10)
          ? 'A nota deve estar entre 0 e 10.'
          : record && v.situacao !== 'CURSANDO' && !v.notaFinal.trim()
            ? 'Informe a nota final para concluir a matrícula.'
            : undefined,
        dataMatricula: !v.dataMatricula
          ? 'Informe a data da matrícula.'
          : v.dataMatricula > todayISO()
            ? 'A data da matrícula não pode ser futura.'
            : undefined,
      }
    },
  )

  const alunoSelect = relationState(alunos, 'alunos', '/alunos', 'Alunos')
  const ofertaSelect = relationState(ofertas, 'ofertas', '/ofertas-disciplinas', 'Ofertas')
  const taken = form.values.alunoId ? takenBy(form.values.alunoId) : new Set<number>()

  const ofertaOptions = ofertas.data
    .map((o) => ({
      value: String(o.id),
      label: ofertaLabel(o, disciplinaMap, professorMap) + (taken.has(o.id) ? ' — já matriculado' : ''),
      disabled: taken.has(o.id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))

  return (
    <FormShell
      onSubmit={form.handleSubmit((v) =>
        submit({
          alunoId: Number(v.alunoId),
          ofertaDisciplinaId: Number(v.ofertaDisciplinaId),
          notaFinal: record && v.notaFinal.trim() ? Number(v.notaFinal.replace(',', '.')) : null,
          situacao: record ? v.situacao as Matricula['situacao'] : 'CURSANDO',
          dataMatricula: v.dataMatricula,
        }),
      )}
      onCancel={cancel}
      saving={saving}
      error={error}
      submitLabel={record ? 'Salvar alterações' : 'Matricular aluno'}
    >
      <Field label="Aluno" htmlFor="alunoId" required error={form.errors.alunoId} hint={alunoSelect.hint}>
        <Select
          {...form.bind('alunoId')}
          autoFocus
          placeholder={alunoSelect.placeholder}
          disabled={alunoSelect.disabled}
          options={alunos.data.map((a) => ({ value: String(a.id), label: `${a.nome} (${a.matriculaInstitucional})` }))}
        />
      </Field>
      <Field
        label="Oferta de disciplina"
        htmlFor="ofertaDisciplinaId"
        required
        error={form.errors.ofertaDisciplinaId}
        hint={ofertaSelect.hint ?? (taken.size > 0 ? 'Ofertas em que o aluno já está matriculado ficam indisponíveis.' : undefined)}
      >
        <Select
          {...form.bind('ofertaDisciplinaId')}
          placeholder={ofertaSelect.placeholder}
          disabled={ofertaSelect.disabled}
          options={ofertaOptions}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        {record ? (
          <Field label="Nota final (0 a 10)" htmlFor="notaFinal" error={form.errors.notaFinal}>
            <Input {...form.bind('notaFinal')} type="number" inputMode="decimal" min={0} max={10} step="0.1" />
          </Field>
        ) : (
          <div className="flex items-center text-sm text-muted">Nota final: definida posteriormente.</div>
        )}
        <Field label="Data da matrícula" htmlFor="dataMatricula" required error={form.errors.dataMatricula}>
          <Input {...form.bind('dataMatricula')} type="date" max={todayISO()} />
        </Field>
      </div>
      {record ? (
        <Field label="Situação" htmlFor="situacao" required>
          <Select {...form.bind('situacao')} options={[
            { value: 'CURSANDO', label: 'Cursando' },
            { value: 'APROVADO', label: 'Aprovado' },
            { value: 'REPROVADO', label: 'Reprovado' },
          ]} />
        </Field>
      ) : (
        <p className="text-sm text-muted">Situação inicial: Cursando.</p>
      )}
    </FormShell>
  )
}

export default function MatriculasPage() {
  const crud = useCrud(matriculasService, { singular: 'matrícula', feminine: true })
  const alunos = useList(alunosService.list)
  const ofertas = useList(ofertasService.list)
  const disciplinas = useList(disciplinasService.list)
  const professores = useList(professoresService.list)
  const query = useTopbarSearch('Buscar por aluno, disciplina ou professor')
  const [alunoId, setAlunoId] = useState('')
  const [ofertaId, setOfertaId] = useState('')

  const alunoMap = useMemo(() => indexById(alunos.data), [alunos.data])
  const ofertaMap = useMemo(() => indexById(ofertas.data), [ofertas.data])
  const disciplinaMap = useMemo(() => indexById(disciplinas.data), [disciplinas.data])
  const professorMap = useMemo(() => indexById(professores.data), [professores.data])

  const alunoNome = (id: number) => alunoMap.get(id)?.nome ?? (alunos.loading ? '…' : `Aluno #${id}`)
  const ofertaTexto = (id: number) => {
    const oferta = ofertaMap.get(id)
    return oferta ? ofertaLabel(oferta, disciplinaMap, professorMap) : ofertas.loading ? '…' : `Oferta #${id}`
  }

  const rows = useMemo(
    () =>
      crud.list.data.filter(
        (m) => (!alunoId || String(m.alunoId) === alunoId) && (!ofertaId || String(m.ofertaDisciplinaId) === ofertaId),
      ),
    [crud.list.data, alunoId, ofertaId],
  )

  const ofertaFilterOptions = ofertas.data
    .map((o) => ({ value: String(o.id), label: ofertaLabel(o, disciplinaMap, professorMap) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))

  const columns: Column<Matricula>[] = [
    { key: 'id', header: 'ID', sortValue: (r) => r.id, render: (r) => r.id, className: 'w-20 tabular-nums text-muted' },
    { key: 'aluno', header: 'Aluno', sortValue: (r) => alunoNome(r.alunoId), render: (r) => <span className="font-medium">{alunoNome(r.alunoId)}</span> },
    {
      key: 'oferta',
      header: 'Oferta de disciplina',
      sortValue: (r) => ofertaTexto(r.ofertaDisciplinaId),
      render: (r) => ofertaTexto(r.ofertaDisciplinaId),
      className: 'hidden lg:table-cell',
    },
    { key: 'situacao', header: 'Situação', sortValue: (r) => r.situacao, render: (r) => ({ CURSANDO: 'Cursando', APROVADO: 'Aprovado', REPROVADO: 'Reprovado' }[r.situacao] ?? 'Cursando') },
    { key: 'nota', header: 'Nota final', sortValue: (r) => r.notaFinal, render: (r) => <span className="tabular-nums">{formatNota(r.notaFinal)}</span> },
    { key: 'data', header: 'Data', sortValue: (r) => r.dataMatricula, render: (r) => <span className="tabular-nums">{formatDate(r.dataMatricula)}</span> },
  ]

  return (
    <>
      <PageHeader
        description="Matrículas em ofertas de disciplinas, com situação, nota final e data."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={crud.openCreate}>
            Nova matrícula
          </Button>
        }
      />
      <div className="rounded-xl border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <FilterSelect
            label="aluno"
            allLabel="Todos os alunos"
            value={alunoId}
            onChange={setAlunoId}
            disabled={alunos.data.length === 0}
            options={alunos.data.map((a) => ({ value: String(a.id), label: a.nome }))}
          />
          <FilterSelect
            label="oferta de disciplina"
            allLabel="Todas as ofertas"
            value={ofertaId}
            onChange={setOfertaId}
            disabled={ofertas.data.length === 0}
            options={ofertaFilterOptions}
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
          searchText={(r) => `${alunoNome(r.alunoId)} ${ofertaTexto(r.ofertaDisciplinaId)}`}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.askDelete}
          emptyIcon={ClipboardList}
          emptyTitle="Nenhuma matrícula registrada"
          emptyDescription="Matricule um aluno em uma oferta de disciplina para começar."
          emptyAction={<Button onClick={crud.openCreate}>Matricular aluno</Button>}
          filtersActive={!!(alunoId || ofertaId)}
          onClearFilters={() => {
            setAlunoId('')
            setOfertaId('')
          }}
          defaultSort={{ key: 'data', dir: 'desc' }}
        />
      </div>
      <CrudDialogs
        crud={crud}
        renderForm={(record, ctx) => (
          <MatriculaForm
            key={record?.id ?? 'nova'}
            record={record}
            matriculas={crud.list.data}
            alunos={alunos}
            ofertas={ofertas}
            disciplinaMap={disciplinaMap}
            professorMap={professorMap}
            {...ctx}
          />
        )}
        details={(r) => [
          { label: 'ID', value: r.id },
          { label: 'Aluno', value: alunoNome(r.alunoId) },
          { label: 'Oferta de disciplina', value: ofertaTexto(r.ofertaDisciplinaId) },
          { label: 'Nota final', value: formatNota(r.notaFinal) },
          { label: 'Situação', value: ({ CURSANDO: 'Cursando', APROVADO: 'Aprovado', REPROVADO: 'Reprovado' }[r.situacao] ?? 'Cursando') },
          { label: 'Data da matrícula', value: formatDate(r.dataMatricula) },
        ]}
        deleteName={(r) => `${alunoNome(r.alunoId)} — ${ofertaTexto(r.ofertaDisciplinaId)}`}
      />
    </>
  )
}
