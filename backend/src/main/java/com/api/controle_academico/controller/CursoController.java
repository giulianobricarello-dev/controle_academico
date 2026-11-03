package com.api.controle_academico.controller;

import jakarta.validation.Valid;
import com.api.controle_academico.dto.CursoDTO;
import com.api.controle_academico.service.CursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService service;

    @GetMapping
    public List<CursoDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CursoDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CursoDTO criar(@Valid @RequestBody CursoDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public CursoDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CursoDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}