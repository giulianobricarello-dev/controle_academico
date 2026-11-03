package com.api.controle_academico.mapper;

import com.api.controle_academico.dto.AlunoDTO;
import com.api.controle_academico.entity.AlunoEntity;
import com.api.controle_academico.entity.CursoEntity;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {

    public AlunoDTO toDTO(AlunoEntity aluno) {
        return new AlunoDTO(
            aluno.getId(),
            aluno.getNome(),
            aluno.getEmail(),
            aluno.getMatriculaInstitucional(),
            aluno.getCurso().getId()
        );
    }

    public AlunoEntity toEntity(AlunoDTO dto, CursoEntity curso) {
        AlunoEntity aluno = new AlunoEntity();

        aluno.setId(dto.getId());
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setCurso(curso);

        return aluno;
    }
}