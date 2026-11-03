package com.api.controle_academico.controller;

import com.api.controle_academico.dto.OfertaDisciplinaDTO;
import com.api.controle_academico.service.OfertaDisciplinaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ofertas-disciplinas")
@RequiredArgsConstructor
public class OfertaDisciplinaController {

    private final OfertaDisciplinaService service;

    @GetMapping
    public List<OfertaDisciplinaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public OfertaDisciplinaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OfertaDisciplinaDTO criar(@Valid @RequestBody OfertaDisciplinaDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public OfertaDisciplinaDTO atualizar(
            @Valid @PathVariable Long id,
            @RequestBody OfertaDisciplinaDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}