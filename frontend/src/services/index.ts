import { createCrudService } from './crud'
import type { Aluno, Curso, Disciplina, Matricula, OfertaDisciplina, Professor } from '../types'

export const alunosService = createCrudService<Aluno>('/alunos')
export const professoresService = createCrudService<Professor>('/professores')
export const cursosService = createCrudService<Curso>('/cursos')
export const disciplinasService = createCrudService<Disciplina>('/disciplinas')
export const ofertasService = createCrudService<OfertaDisciplina>('/ofertas-disciplinas')
export const matriculasService = createCrudService<Matricula>('/matriculas')

export { getErrorMessage, getStatus } from './errors'
export { API_URL } from './api'
export type { CrudService } from './crud'
