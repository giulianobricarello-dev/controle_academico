
package com.api.controle_academico.mapper;

import com.api.controle_academico.dto.MatriculaDTO;
import com.api.controle_academico.entity.AlunoEntity;
import com.api.controle_academico.entity.MatriculaEntity;
import com.api.controle_academico.entity.OfertaDisciplinaEntity;
import org.springframework.stereotype.Component;

@Component
public class MatriculaMapper {

    public MatriculaDTO toDTO(MatriculaEntity matricula) {
        return new MatriculaDTO(
            matricula.getId(),
            matricula.getNotaFinal(),
            matricula.getSituacao() == null ? com.api.controle_academico.entity.SituacaoMatricula.CURSANDO : matricula.getSituacao(),
            matricula.getDataMatricula(),
            matricula.getAluno().getId(),
            matricula.getOfertaDisciplina().getId()
        );
    }

    
    public MatriculaEntity toEntity(
            MatriculaDTO dto,
            AlunoEntity aluno,
            OfertaDisciplinaEntity ofertaDisciplina) {

        MatriculaEntity matricula = new MatriculaEntity();

        matricula.setId(dto.getId());
        matricula.setNotaFinal(dto.getNotaFinal());
        matricula.setSituacao(dto.getSituacao());
        matricula.setDataMatricula(dto.getDataMatricula());
        matricula.setAluno(aluno);
        matricula.setOfertaDisciplina(ofertaDisciplina);

        return matricula;
    }
}
