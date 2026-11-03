
package com.api.controle_academico.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "disciplina")
public class DisciplinaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Integer cargaHoraria;

    @ManyToOne(optional = false)
    @JoinColumn(name = "curso_id")
    private CursoEntity curso;
}
