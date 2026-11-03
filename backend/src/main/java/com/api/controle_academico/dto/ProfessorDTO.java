package com.api.controle_academico.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorDTO {
    
private Long id;

@NotBlank(message = "O nome do professor é obrigatório")
private String nome;

@NotBlank(message = "O e-mail é obrigatório")
@Email(message = "O e-mail deve ser válido")
private String email;

private String matriculaInstitucional;
}
