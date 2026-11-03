import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ClipboardList, Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { useList, type ListState } from '../hooks/useList'
import { formatDate, formatNota } from '../lib/format'
import { indexById } from '../lib/lookups'
import { NAV_ITEMS } from '../navigation'
import {
  alunosService,
  cursosService,
  disciplinasService,
  matriculasService,
  ofertasService,
  professoresService,
} from '../services'

function StatCard({ label, to, list }: { label: string; to: string; list: ListState<unknown> }) {
  const item = NAV_ITEMS.find((n) => n.path === to)
  const Icon = item?.icon ?? ClipboardList
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 shadow-card">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        {list.loading ? (
          <Skeleton className="mt-2 h-8 w-16" />
        ) : (
          <p className="font-serif text-3xl font-semibold tabular-nums text-ink" aria-label={`${label}: ${list.error ? 'indisponível' : list.data.length}`}>
            {list.error ? '—' : list.data.length}
          </p>
        )}
      </div>
    </div>
  )
}

const QUICK_ACCESS = [
  { to: '/alunos?novo=1', label: 'Novo aluno', hint: 'Cadastrar e vincular a um curso' },
  { to: '/professores?novo=1', label: 'Novo professor', hint: 'Cadastrar docente' },
  { to: '/cursos?novo=1', label: 'Novo curso', hint: 'Adicionar um curso' },
  { to: '/disciplinas?novo=1', label: 'Nova disciplina', hint: 'Definir carga horária e curso' },
  { to: '/ofertas-disciplinas?novo=1', label: 'Nova oferta', hint: 'Disciplina + professor + semestre' },
  { to: '/matriculas?novo=1', label: 'Nova matrícula', hint: 'Matricular aluno em uma oferta' },
]

export default function Dashboard() {
  const alunos = useList(alunosService.list)
  const professores = useList(professoresService.list)
  const cursos = useList(cursosService.list)
  const disciplinas = useList(disciplinasService.list)
  const ofertas = useList(ofertasService.list)
  const matriculas = useList(matriculasService.list)

  const all = [alunos, professores, cursos, disciplinas, ofertas, matriculas]
  const firstError = all.find((l) => l.error)?.error ?? null
  const retryAll = () => all.forEach((l) => l.error && void l.reload())

  const alunoMap = useMemo(() => indexById(alunos.data), [alunos.data])
  const ofertaMap = useMemo(() => indexById(ofertas.data), [ofertas.data])
  const disciplinaMap = useMemo(() => indexById(disciplinas.data), [disciplinas.data])

  const recentes = useMemo(
    () =>
      [...matriculas.data]
        .sort((a, b) => b.dataMatricula.localeCompare(a.dataMatricula) || b.id - a.id)
        .slice(0, 5),
    [matriculas.data],
  )

  return (
    <div className="space-y-6">
      {firstError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
          <p className="min-w-0 flex-1">{firstError}</p>
          <Button variant="secondary" onClick={retryAll}>
            Tentar novamente
          </Button>
        </div>
      )}

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Alunos" to="/alunos" list={alunos} />
        <StatCard label="Professores" to="/professores" list={professores} />
        <StatCard label="Cursos" to="/cursos" list={cursos} />
        <StatCard label="Disciplinas" to="/disciplinas" list={disciplinas} />
        <StatCard label="Ofertas de disciplinas" to="/ofertas-disciplinas" list={ofertas} />
        <StatCard label="Matrículas" to="/matriculas" list={matriculas} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-line bg-surface shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Matrículas recentes</h2>
            <Link to="/matriculas" className="text-sm font-medium text-brand hover:underline">
              Ver todas
            </Link>
          </div>
          {matriculas.loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : matriculas.error ? (
            <p className="px-5 py-10 text-center text-sm text-muted">Os dados de matrículas não puderam ser carregados.</p>
          ) : recentes.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nenhuma matrícula registrada"
              description="As matrículas mais recentes aparecerão aqui."
              action={
                <Link to="/matriculas?novo=1">
                  <Button>Nova matrícula</Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <thead className="border-b border-line bg-canvas/60 text-xs font-semibold text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3">Aluno</th>
                    <th scope="col" className="px-5 py-3">Disciplina</th>
                    <th scope="col" className="px-5 py-3">Nota</th>
                    <th scope="col" className="px-5 py-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentes.map((m) => {
                    const oferta = ofertaMap.get(m.ofertaDisciplinaId)
                    const disciplina = oferta ? disciplinaMap.get(oferta.disciplinaId)?.nome : undefined
                    return (
                      <tr key={m.id}>
                        <td className="px-5 py-3 font-medium">{alunoMap.get(m.alunoId)?.nome ?? `Aluno #${m.alunoId}`}</td>
                        <td className="px-5 py-3">
                          {disciplina ?? `Oferta #${m.ofertaDisciplinaId}`}
                          {oferta && <span className="ml-2 tabular-nums text-muted">{oferta.semestre}</span>}
                        </td>
                        <td className="px-5 py-3 tabular-nums">{formatNota(m.notaFinal)}</td>
                        <td className="px-5 py-3 tabular-nums">{formatDate(m.dataMatricula)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-line bg-surface shadow-card">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Acesso rápido</h2>
          </div>
          <ul className="divide-y divide-line">
            {QUICK_ACCESS.map((q) => (
              <li key={q.to}>
                <Link to={q.to} className="flex items-center gap-3 px-5 py-3 hover:bg-canvas/60">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">{q.label}</span>
                    <span className="block truncate text-xs text-muted">{q.hint}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
