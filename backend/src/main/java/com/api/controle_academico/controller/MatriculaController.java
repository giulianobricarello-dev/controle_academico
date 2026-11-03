
package com.api.controle_academico.controller;

import com.api.controle_academico.dto.MatriculaDTO;
import com.api.controle_academico.service.MatriculaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matriculas")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService service;

    @GetMapping
    public List<MatriculaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public MatriculaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatriculaDTO criar(@Valid @RequestBody MatriculaDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public MatriculaDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MatriculaDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
