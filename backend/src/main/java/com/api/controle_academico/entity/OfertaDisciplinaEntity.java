package com.api.controle_academico.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "oferta_disciplina")
public class OfertaDisciplinaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String semestre;

    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id")
    private DisciplinaEntity disciplina;

    @ManyToOne(optional = false)
    @JoinColumn(name = "professor_id")
    private ProfessorEntity professor;
}
