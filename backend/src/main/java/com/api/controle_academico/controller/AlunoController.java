
package com.api.controle_academico.controller;

import com.api.controle_academico.dto.AlunoDTO;
import com.api.controle_academico.service.AlunoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService service;

    @GetMapping
    public List<AlunoDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public AlunoDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlunoDTO criar(@Valid @RequestBody AlunoDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public AlunoDTO atualizar(
            @Valid @PathVariable Long id,
            @RequestBody AlunoDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
