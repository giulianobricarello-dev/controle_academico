package com.api.controle_academico.repository;
import com.api.controle_academico.entity.OfertaDisciplinaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfertaDisciplinaRepository extends JpaRepository<OfertaDisciplinaEntity, Long> {

boolean existsByDisciplinaIdAndProfessorIdAndSemestre(Long disciplinaId, Long professorId, String semestre);

boolean existsByDisciplinaIdAndProfessorIdAndSemestreAndIdNot(Long disciplinaId, Long professorId,String semestre, Long id);
}
