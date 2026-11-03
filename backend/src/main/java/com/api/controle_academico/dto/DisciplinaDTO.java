package com.api.controle_academico.dto;


import jakarta.validation.constraints.Positive;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class DisciplinaDTO {

    private Long id;

@NotBlank(message = "O nome da disciplina é obrigatório")
private String nome;

@NotNull(message = "A carga horária é obrigatória")
@Positive(message = "A carga horária deve ser maior que zero")
private Integer cargaHoraria;

@NotNull(message = "O curso é obrigatório")
private Long cursoId;
}
