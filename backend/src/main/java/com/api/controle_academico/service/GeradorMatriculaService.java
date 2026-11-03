package com.api.controle_academico.service;

import com.api.controle_academico.entity.SequenciaMatriculaEntity;
import com.api.controle_academico.repository.SequenciaMatriculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class GeradorMatriculaService {
    private final SequenciaMatriculaRepository sequenciaRepository;

    public String gerarParaAluno() {
        return gerar("A");
    }

    public String gerarParaProfessor() {
        return gerar("P");
    }

    private String gerar(String tipo) {
        // IDENTITY no MySQL reserva uma sequência exclusiva antes do INSERT do usuário.
        Long numero = sequenciaRepository.saveAndFlush(new SequenciaMatriculaEntity()).getId();
        return String.format("%d%s%06d", Year.now().getValue(), tipo, numero);
    }
}
