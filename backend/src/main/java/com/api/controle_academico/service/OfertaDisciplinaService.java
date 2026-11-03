package com.api.controle_academico.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.api.controle_academico.dto.OfertaDisciplinaDTO;
import com.api.controle_academico.entity.DisciplinaEntity;
import com.api.controle_academico.entity.OfertaDisciplinaEntity;
import com.api.controle_academico.entity.ProfessorEntity;
import com.api.controle_academico.mapper.OfertaDisciplinaMapper;
import com.api.controle_academico.repository.OfertaDisciplinaRepository;
import com.api.controle_academico.repository.ProfessorRepository;
import com.api.controle_academico.repository.DisciplinaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OfertaDisciplinaService {
    private final OfertaDisciplinaRepository repository;
    private final OfertaDisciplinaMapper mapper;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    


    public List<OfertaDisciplinaDTO> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public OfertaDisciplinaDTO buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidade(id));
    }

    public OfertaDisciplinaDTO criar(OfertaDisciplinaDTO dto) {

        DisciplinaEntity disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
        .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Disciplina não encontrada"));

        
        ProfessorEntity professor = professorRepository.findById(dto.getProfessorId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));

        if (repository.existsByDisciplinaIdAndProfessorIdAndSemestre(dto.getDisciplinaId(), dto.getProfessorId(), dto.getSemestre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Essa oferta de disciplina já existe");
        }

        OfertaDisciplinaEntity oferta = mapper.toEntity(dto, disciplina, professor);
        oferta.setId(null);

         return mapper.toDTO(repository.save(oferta));
    }

    public OfertaDisciplinaDTO atualizar(Long id, OfertaDisciplinaDTO dto) {
        buscarEntidade(id);

        DisciplinaEntity disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"))  ;

        ProfessorEntity professor = professorRepository.findById(dto.getProfessorId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));

        if (repository.existsByDisciplinaIdAndProfessorIdAndSemestreAndIdNot(dto.getDisciplinaId(), dto.getProfessorId(), dto.getSemestre(),id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Essa oferta de disciplina já existe");
        }

    OfertaDisciplinaEntity oferta = mapper.toEntity(dto, disciplina, professor);
        oferta.setId(id);

        return mapper.toDTO(repository.save(oferta));

    }

    public void deletar(Long id) {
        repository.delete(buscarEntidade(id));
    }


    private OfertaDisciplinaEntity buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Oferta de disciplina não encontrada"));
    }
}
