package com.api.controle_academico.mapper;

import com.api.controle_academico.dto.DisciplinaDTO;
import com.api.controle_academico.entity.CursoEntity;
import com.api.controle_academico.entity.DisciplinaEntity;
import org.springframework.stereotype.Component;

@Component
public class DisciplinaMapper {

    public DisciplinaDTO toDTO(DisciplinaEntity disciplina) {
        DisciplinaDTO dto = new DisciplinaDTO();

        dto.setId(disciplina.getId());
        dto.setNome(disciplina.getNome());
        dto.setCargaHoraria(disciplina.getCargaHoraria());
        dto.setCursoId(disciplina.getCurso().getId());

        return dto;
    }

    public DisciplinaEntity toEntity(
            DisciplinaDTO dto,
            CursoEntity curso
    ) {
        DisciplinaEntity disciplina = new DisciplinaEntity();

        disciplina.setId(dto.getId());
        disciplina.setNome(dto.getNome());
        disciplina.setCargaHoraria(dto.getCargaHoraria());
        disciplina.setCurso(curso);

        return disciplina;
    }
}