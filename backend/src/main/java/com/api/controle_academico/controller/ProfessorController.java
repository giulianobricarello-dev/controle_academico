package com.api.controle_academico.controller;

import com.api.controle_academico.dto.ProfessorDTO;
import com.api.controle_academico.service.ProfessorService ;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService service;

    @GetMapping
    public List<ProfessorDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ProfessorDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
@ResponseStatus(HttpStatus.CREATED)
public ProfessorDTO criar(@Valid @RequestBody ProfessorDTO dto) {
    return service.criar(dto);
}

    @PutMapping("/{id}")
    public ProfessorDTO atualizar(
            @Valid @PathVariable Long id,
            @RequestBody ProfessorDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
