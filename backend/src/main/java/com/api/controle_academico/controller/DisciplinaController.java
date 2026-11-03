package com.api.controle_academico.controller;

import jakarta.validation.Valid;
import com.api.controle_academico.dto.DisciplinaDTO;
import com.api.controle_academico.service.DisciplinaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaService service;

    @GetMapping
    public List<DisciplinaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public DisciplinaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DisciplinaDTO criar(@Valid @RequestBody DisciplinaDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public DisciplinaDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DisciplinaDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}