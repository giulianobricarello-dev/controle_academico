
package com.api.controle_academico.mapper;

import com.api.controle_academico.dto.CursoDTO;
import com.api.controle_academico.entity.CursoEntity;
import org.springframework.stereotype.Component;

@Component
public class CursoMapper {

    public CursoDTO toDTO(CursoEntity curso) {
        return new CursoDTO(
            curso.getId(),
            curso.getNome()
        );
    }

    public CursoEntity toEntity(CursoDTO dto) {
        CursoEntity curso = new CursoEntity();

        curso.setId(dto.getId());
        curso.setNome(dto.getNome());

        return curso;
    }
}
