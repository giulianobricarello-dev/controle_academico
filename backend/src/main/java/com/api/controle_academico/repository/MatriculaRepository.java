package com.api.controle_academico.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.controle_academico.entity.MatriculaEntity;

public interface MatriculaRepository extends JpaRepository<MatriculaEntity, Long> {
    boolean existsByAlunoIdAndOfertaDisciplinaId(
        Long alunoId,
        Long ofertaDisciplinaId
);

    boolean existsByAlunoIdAndOfertaDisciplinaIdAndIdNot(
        Long alunoId,
        Long ofertaDisciplinaId,
        Long id
);
}
