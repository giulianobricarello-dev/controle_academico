package com.api.controle_academico.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoDTO {

    private Long id;
    
    @NotBlank(message = "O nome do curso é obrigatório")
    private String nome;
}
