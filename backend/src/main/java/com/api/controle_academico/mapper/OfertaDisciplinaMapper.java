
package com.api.controle_academico.mapper;

import com.api.controle_academico.dto.OfertaDisciplinaDTO;
import com.api.controle_academico.entity.DisciplinaEntity;
import com.api.controle_academico.entity.OfertaDisciplinaEntity;
import com.api.controle_academico.entity.ProfessorEntity;
import org.springframework.stereotype.Component;

@Component
public class OfertaDisciplinaMapper {

    public OfertaDisciplinaDTO toDTO(OfertaDisciplinaEntity ofertaDisciplina) {
        return new OfertaDisciplinaDTO(
            ofertaDisciplina.getId(),
            ofertaDisciplina.getSemestre(),
            ofertaDisciplina.getDisciplina().getId(),
            ofertaDisciplina.getProfessor().getId()
        );
    }

    public OfertaDisciplinaEntity toEntity(
            OfertaDisciplinaDTO dto,
            DisciplinaEntity disciplina,
            ProfessorEntity professor) {

        OfertaDisciplinaEntity ofertaDisciplina = new OfertaDisciplinaEntity();

        ofertaDisciplina.setId(dto.getId());
        ofertaDisciplina.setSemestre(dto.getSemestre());
        ofertaDisciplina.setDisciplina(disciplina);
        ofertaDisciplina.setProfessor(professor);

        return ofertaDisciplina;
    }
}
