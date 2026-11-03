package com.api.controle_academico.repository;
import com.api.controle_academico.entity.DisciplinaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaRepository extends JpaRepository<DisciplinaEntity, Long> {
   boolean existsByNome(String nome);
}
