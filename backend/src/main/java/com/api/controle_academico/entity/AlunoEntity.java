
package com.api.controle_academico.entity;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "aluno")
public class AlunoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String nome;

    @Column(unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String matriculaInstitucional;

    @ManyToOne(optional = false)
    @JoinColumn(name = "curso_id")
    private CursoEntity curso;
}
