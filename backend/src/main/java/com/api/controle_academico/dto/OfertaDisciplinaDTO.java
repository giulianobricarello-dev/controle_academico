package com.api.controle_academico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaDisciplinaDTO {

    private Long id;
    @NotBlank (message = "O semestre é obrigatório")
    private String semestre;
    @NotNull(message = "O ID da disciplina é obrigatório")
    private Long disciplinaId;
    @NotNull(message = "O ID do professor é obrigatório")
    private Long professorId;
}
