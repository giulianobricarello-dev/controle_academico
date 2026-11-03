import type { Disciplina, OfertaDisciplina, Professor } from '../types'

export function indexById<T extends { id: number }>(items: T[]): Map<number, T> {
  return new Map(items.map((item) => [item.id, item]))
}

export function ofertaLabel(
  oferta: OfertaDisciplina,
  disciplinas: Map<number, Disciplina>,
  professores: Map<number, Professor>,
): string {
  const disciplina = disciplinas.get(oferta.disciplinaId)?.nome ?? `Disciplina #${oferta.disciplinaId}`
  const professor = professores.get(oferta.professorId)?.nome ?? `Professor #${oferta.professorId}`
  return `${disciplina} — ${professor} (${oferta.semestre})`
}
