package com.api.controle_academico.repository;

import com.api.controle_academico.entity.AlunoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<AlunoEntity, Long> {
boolean existsByEmail(String email);

boolean existsByMatriculaInstitucional(String matriculaInstitucional);

}
