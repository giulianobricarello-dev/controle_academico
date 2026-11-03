package com.api.controle_academico.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "matricula", uniqueConstraints = @UniqueConstraint(columnNames = {"aluno_id", "oferta_disciplina_id"}))
@Getter
@Setter
@NoArgsConstructor

public class MatriculaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double notaFinal;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao", length = 20)
    private SituacaoMatricula situacao;

    private LocalDate dataMatricula;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id")
    private AlunoEntity aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "oferta_disciplina_id")
    private OfertaDisciplinaEntity ofertaDisciplina;
}
