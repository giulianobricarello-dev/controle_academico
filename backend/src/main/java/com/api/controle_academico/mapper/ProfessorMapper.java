
package com.api.controle_academico.mapper;

import com.api.controle_academico.dto.ProfessorDTO;
import com.api.controle_academico.entity.ProfessorEntity;
import org.springframework.stereotype.Component;

@Component
public class ProfessorMapper {

    public ProfessorDTO toDTO(ProfessorEntity professor) {
        return new ProfessorDTO(
            professor.getId(),
            professor.getNome(),
            professor.getEmail(),
            professor.getMatriculaInstitucional()
        );
    }

    public ProfessorEntity toEntity(ProfessorDTO dto) {
        ProfessorEntity professor = new ProfessorEntity();

        professor.setId(dto.getId());
        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());

        return professor;
    }
}
