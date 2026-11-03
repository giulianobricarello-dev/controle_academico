package com.api.controle_academico.repository;

import com.api.controle_academico.entity.CursoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<CursoEntity, Long> {
boolean existsByNome(String nome);
}
