
package com.api.controle_academico.service;

import com.api.controle_academico.dto.CursoDTO;
import com.api.controle_academico.entity.CursoEntity;
import com.api.controle_academico.mapper.CursoMapper;
import com.api.controle_academico.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository repository;
    private final CursoMapper mapper;

    public List<CursoDTO> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public CursoDTO buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidade(id));
    }

    public CursoDTO criar(CursoDTO dto) {

        String nome = dto.getNome().trim();

        if (repository.existsByNome(nome)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Já existe um curso com esse nome");
        }

        dto.setNome(nome);

        CursoEntity curso = mapper.toEntity(dto);
        curso.setId(null);

        return mapper.toDTO(repository.save(curso));
    }

    public CursoDTO atualizar(Long id, CursoDTO dto) {

        CursoEntity cursoExistente = buscarEntidade(id);

       String nome = dto.getNome().trim();

        if (repository.existsByNome(nome)
                && !cursoExistente.getNome().equals(nome)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Já existe um curso com esse nome");
        }

        dto.setNome(nome);

        CursoEntity curso = mapper.toEntity(dto);
        curso.setId(id);

        return mapper.toDTO(repository.save(curso));
    }

    public void deletar(Long id) {
        repository.delete(buscarEntidade(id));
    }

    

    private CursoEntity buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Curso não encontrado"));
    }
}