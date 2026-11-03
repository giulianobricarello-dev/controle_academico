
package com.api.controle_academico.service;

import com.api.controle_academico.repository.CursoRepository;
import com.api.controle_academico.entity.CursoEntity;
import com.api.controle_academico.dto.DisciplinaDTO;
import com.api.controle_academico.entity.DisciplinaEntity;
import com.api.controle_academico.mapper.DisciplinaMapper;
import com.api.controle_academico.repository.DisciplinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplinaService {

    private final DisciplinaRepository repository;
    private final DisciplinaMapper mapper;
    private final CursoRepository cursoRepository;

    public List<DisciplinaDTO> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public DisciplinaDTO buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidade(id));
    }

    public DisciplinaDTO criar(DisciplinaDTO dto) {

        String nome = dto.getNome().trim();

        if (repository.existsByNome(nome)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma disciplina com esse nome"
            );
        }

        dto.setNome(nome);

        CursoEntity curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Curso não encontrado"
                ));

        DisciplinaEntity disciplina = mapper.toEntity(dto, curso);
        disciplina.setId(null);

        return mapper.toDTO(repository.save(disciplina));
    }

    public DisciplinaDTO atualizar(Long id, DisciplinaDTO dto) {

        DisciplinaEntity disciplinaExistente = buscarEntidade(id);

        String nome = dto.getNome().trim();

        if (repository.existsByNome(nome)
                && !disciplinaExistente.getNome().equals(nome)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma disciplina com esse nome"
            );
        }

        dto.setNome(nome);

        CursoEntity curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Curso não encontrado"
                ));

        DisciplinaEntity disciplina = mapper.toEntity(dto, curso);
        disciplina.setId(id);

        return mapper.toDTO(repository.save(disciplina));
    }

    public void deletar(Long id) {
        repository.delete(buscarEntidade(id));
    }

   
    private DisciplinaEntity buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Disciplina não encontrada"));
    }
}
