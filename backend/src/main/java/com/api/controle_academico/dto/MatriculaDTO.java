package com.api.controle_academico.dto;

import lombok.*;
import com.api.controle_academico.entity.SituacaoMatricula;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatriculaDTO {

    private Long id;

    @DecimalMin(value = "0.0", message = "A nota não pode ser negativa")
    @DecimalMax(value = "10.0", message = "A nota não pode ultrapassar 10")
    private Double notaFinal;

    private SituacaoMatricula situacao;


    @NotNull(message = "A data da matrícula é obrigatória")
    @PastOrPresent(message = "A data da matrícula não pode ser futura")
    private LocalDate dataMatricula;

    @NotNull(message = "O ID do aluno é obrigatório")
    private Long alunoId;
    @NotNull(message = "O ID da oferta de disciplina é obrigatório")
    private Long ofertaDisciplinaId;
}
