
package com.api.controle_academico.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.api.controle_academico.dto.MatriculaDTO;
import com.api.controle_academico.entity.AlunoEntity;
import com.api.controle_academico.entity.MatriculaEntity;
import com.api.controle_academico.entity.SituacaoMatricula;
import com.api.controle_academico.entity.OfertaDisciplinaEntity;
import com.api.controle_academico.mapper.MatriculaMapper;
import com.api.controle_academico.repository.AlunoRepository;
import com.api.controle_academico.repository.MatriculaRepository;
import com.api.controle_academico.repository.OfertaDisciplinaRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MatriculaService {

    private final MatriculaRepository repository;
    private final MatriculaMapper mapper;
    private final AlunoRepository alunoRepository;
    private final OfertaDisciplinaRepository ofertaDisciplinaRepository;

    public List<MatriculaDTO> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public MatriculaDTO buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidade(id));
    }

    public MatriculaDTO criar(MatriculaDTO dto) {

        AlunoEntity aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        OfertaDisciplinaEntity oferta = ofertaDisciplinaRepository.findById(dto.getOfertaDisciplinaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Oferta de disciplina não encontrada"));

        if (repository.existsByAlunoIdAndOfertaDisciplinaId(
                dto.getAlunoId(), dto.getOfertaDisciplinaId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esse aluno já está matriculado nessa oferta de disciplina");
        }

        MatriculaEntity matricula = mapper.toEntity(dto, aluno, oferta);
        matricula.setId(null);
        matricula.setNotaFinal(null);
        matricula.setSituacao(SituacaoMatricula.CURSANDO);

        return mapper.toDTO(repository.save(matricula));
    }

    public MatriculaDTO atualizar(Long id, MatriculaDTO dto) {
        buscarEntidade(id);

        AlunoEntity aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        OfertaDisciplinaEntity oferta = ofertaDisciplinaRepository.findById(dto.getOfertaDisciplinaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Oferta de disciplina não encontrada"));

        if (repository.existsByAlunoIdAndOfertaDisciplinaIdAndIdNot(
                dto.getAlunoId(), dto.getOfertaDisciplinaId(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esse aluno já está matriculado nessa oferta de disciplina");
        }

        MatriculaEntity matricula = mapper.toEntity(dto, aluno, oferta);
        matricula.setId(id);
        if (dto.getSituacao() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a situação da matrícula");
        }
        if (dto.getSituacao() != SituacaoMatricula.CURSANDO && dto.getNotaFinal() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Informe a nota final para concluir a matrícula");
        }

        return mapper.toDTO(repository.save(matricula));
    }

    public void deletar(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private MatriculaEntity buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Matrícula não encontrada"));
    }
}
