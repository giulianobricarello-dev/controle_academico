package com.api.controle_academico.service;

import java.util.List;
import com.api.controle_academico.dto.AlunoDTO;
import com.api.controle_academico.entity.AlunoEntity;
import com.api.controle_academico.entity.CursoEntity;
import com.api.controle_academico.mapper.AlunoMapper;
import com.api.controle_academico.repository.AlunoRepository;
import com.api.controle_academico.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AlunoService {
    private final AlunoRepository repository;
    private final AlunoMapper mapper;
    private final CursoRepository cursoRepository;
    private final GeradorMatriculaService geradorMatricula;

    public List<AlunoDTO> listar() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    public AlunoDTO buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidade(id));
    }

    @Transactional
    public AlunoDTO criar(AlunoDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um aluno com esse e-mail");
        }
        CursoEntity curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso não encontrado"));

        AlunoEntity aluno = mapper.toEntity(dto, curso);
        aluno.setId(null);
        aluno.setMatriculaInstitucional(geradorMatricula.gerarParaAluno());
        return mapper.toDTO(repository.save(aluno));
    }

    @Transactional
    public AlunoDTO atualizar(Long id, AlunoDTO dto) {
        AlunoEntity alunoExistente = buscarEntidade(id);
        if (repository.existsByEmail(dto.getEmail()) && !alunoExistente.getEmail().equals(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um aluno com esse e-mail");
        }
        CursoEntity curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso não encontrado"));

        // Atualiza a entidade existente, mantendo o ID e a matrícula institucional originais.
        alunoExistente.setNome(dto.getNome());
        alunoExistente.setEmail(dto.getEmail());
        alunoExistente.setCurso(curso);
        return mapper.toDTO(repository.save(alunoExistente));
    }

    public void deletar(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private AlunoEntity buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
    }
}
