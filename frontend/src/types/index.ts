// Tipos espelhando exatamente os DTOs do backend (pacote com.api.controle_academico.dto).

export interface Curso {
  id: number
  nome: string
}

export interface Aluno {
  id: number
  nome: string
  email: string
  matriculaInstitucional: string
  cursoId: number
}

export interface Professor {
  id: number
  nome: string
  email: string
  matriculaInstitucional: string
}

export interface Disciplina {
  id: number
  nome: string
  cargaHoraria: number
  cursoId: number
}

export interface OfertaDisciplina {
  id: number
  semestre: string // AAAA.1 ou AAAA.2
  disciplinaId: number
  professorId: number
}

export type SituacaoMatricula = 'CURSANDO' | 'APROVADO' | 'REPROVADO'

export interface Matricula {
  id: number
  notaFinal: number | null // 0 a 10, opcional enquanto cursando
  situacao: SituacaoMatricula
  dataMatricula: string // AAAA-MM-DD
  alunoId: number
  ofertaDisciplinaId: number
}

/** Corpo enviado em POST/PUT: o id é definido pelo backend / pela URL. */
export type Input<T> = Omit<T, 'id' | 'matriculaInstitucional'>
