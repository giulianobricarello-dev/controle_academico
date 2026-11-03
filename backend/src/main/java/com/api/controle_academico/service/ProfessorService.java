package com.api.controle_academico.service;

import java.util.List;
import com.api.controle_academico.dto.ProfessorDTO;
import com.api.controle_academico.entity.ProfessorEntity;
import com.api.controle_academico.mapper.ProfessorMapper;
import com.api.controle_academico.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository repository;
    private final ProfessorMapper mapper;
    private final GeradorMatriculaService geradorMatricula;

    public List<ProfessorDTO> listar() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    public ProfessorDTO buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidade(id));
    }

    @Transactional
    public ProfessorDTO criar(ProfessorDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um professor com esse e-mail");
        }
        ProfessorEntity professor = mapper.toEntity(dto);
        professor.setId(null);
        professor.setMatriculaInstitucional(geradorMatricula.gerarParaProfessor());
        return mapper.toDTO(repository.save(professor));
    }

    @Transactional
    public ProfessorDTO atualizar(Long id, ProfessorDTO dto) {
        ProfessorEntity professorExistente = buscarEntidade(id);
        if (repository.existsByEmail(dto.getEmail()) && !professorExistente.getEmail().equals(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um professor com esse e-mail");
        }
        professorExistente.setNome(dto.getNome());
        professorExistente.setEmail(dto.getEmail());
        return mapper.toDTO(repository.save(professorExistente));
    }

    public void deletar(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private ProfessorEntity buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
    }
}
