package com.api.controle_academico.repository;
import com.api.controle_academico.entity.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, Long> {
    boolean existsByEmail(String email);

    boolean existsByMatriculaInstitucional(String matriculaInstitucional);
}
