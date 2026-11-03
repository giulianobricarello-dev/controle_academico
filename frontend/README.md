# Controle Acadêmico — Frontend

Interface administrativa (React + TypeScript + Vite + Tailwind CSS) para a API REST
**controle-academico** (Java / Spring Boot / Spring Data JPA / MySQL).

O frontend **não usa dados fictícios**: tudo vem dos endpoints reais. Se a API estiver fora do ar,
as telas mostram uma mensagem de erro de conexão com o botão "Tentar novamente".

## Requisitos

- Node.js 18.18+ (recomendado 20 ou 22) e npm
- API do backend rodando (por padrão em `http://localhost:8080`)

## Instalação e execução

```bash
npm install
cp .env.example .env     # ajuste a URL da API se precisar
npm run dev              # http://localhost:5173
```

Outros comandos:

```bash
npm run build            # checa os tipos e gera a pasta dist/
npm run preview          # serve a build de produção localmente
```

## Configuração da URL da API

A URL base fica em um único lugar: a variável `VITE_API_URL` do arquivo `.env`
(lida em `src/services/api.ts`). Se não for definida, usa `http://localhost:8080`.

```env
VITE_API_URL=http://localhost:8080
```

## Dois ajustes recomendados no backend

O backend enviado **não** tem CORS configurado, e o Spring Boot, por padrão, não inclui a mensagem
das exceções na resposta de erro. Sem os ajustes abaixo o navegador bloqueia as chamadas e os
avisos de erro ficam genéricos.

1. **CORS** — copie `backend-extras/CorsConfig.java` para
   `src/main/java/com/api/controle_academico/config/CorsConfig.java`.
   *Alternativa sem mexer no backend:* use `VITE_API_URL=/api` no `.env`; o servidor de
   desenvolvimento do Vite encaminha `/api/*` para `http://localhost:8080` (veja `vite.config.ts`).
2. **Mensagens de erro** — acrescente ao `application.properties` as linhas de
   `backend-extras/application.properties.additions`
   (`server.error.include-message=always` e `server.error.include-binding-errors=always`).
   Assim textos como "Já existe um aluno com esse e-mail" aparecem para o usuário.

## Mapeamento com a API

| Página | Endpoint | Campos enviados (DTO) |
|---|---|---|
| Alunos | `/alunos` | `nome`, `email`, `matriculaInstitucional`, `cursoId` |
| Professores | `/professores` | `nome`, `email`, `matriculaInstitucional` |
| Cursos | `/cursos` | `nome` |
| Disciplinas | `/disciplinas` | `nome`, `cargaHoraria`, `cursoId` |
| Ofertas de disciplinas | `/ofertas-disciplinas` | `semestre` (AAAA.1 ou AAAA.2), `disciplinaId`, `professorId` |
| Matrículas | `/matriculas` | `notaFinal` (0–10), `dataMatricula` (AAAA-MM-DD), `alunoId`, `ofertaDisciplinaId` |

Observações de acordo com o backend:

- `matriculaInstitucional` é **obrigatória** no cadastro (a API não a gera automaticamente).
- Matrícula: `notaFinal` é obrigatória e a data não pode ser futura. O formulário também desabilita
  as ofertas em que o aluno já está matriculado; a validação definitiva continua no backend (409).
- Excluir um registro que tem vínculos (ex.: curso com alunos) pode devolver erro 409/500 do backend;
  o frontend avisa que existem registros vinculados.
- `spring.jpa.hibernate.ddl-auto=create` recria as tabelas a cada inicialização da API,
  então os dados são apagados ao reiniciar o backend. Use `update` se quiser manter os dados.

## Estrutura

```
src/
  components/ui/   Button, Modal, ConfirmDialog, Toast, DataTable, Field/Input/Select,
                   FormShell, DetailList, FilterSelect, Skeleton, EmptyState, CrudDialogs
  hooks/           useList (GET da lista), useCrud (ciclo completo do CRUD), useForm,
                   useTopbarSearch (busca na barra superior), useTheme
  layouts/         AppLayout (sidebar fixa + barra superior)
  pages/           Dashboard e uma página por recurso
  services/        api.ts (Axios + URL base), crud.ts (GET/POST/PUT/DELETE genérico),
                   errors.ts (tradução dos erros HTTP), index.ts (um serviço por recurso)
  types/           Interfaces espelhando os DTOs do backend
  lib/             formatação de datas/notas e junções entre entidades
```

## Comportamento

- **Pesquisa** na barra superior (nome, e-mail, matrícula etc.), **ordenação** clicando no
  cabeçalho e **paginação** local (10 por página).
- **Filtros**: alunos e disciplinas por curso; ofertas por semestre, disciplina e professor;
  matrículas por aluno e oferta.
- Visualizar e editar usam `GET /recurso/{id}`; se o registro já foi removido (404), a lista é atualizada.
- Exclusão sempre pede confirmação. Listas são recarregadas após cada operação.
- Atalhos do Dashboard abrem o cadastro direto (`/alunos?novo=1`, etc.).
- Tema escuro opcional (botão na barra superior; a escolha fica salva no navegador).
- Erros tratados: 400, 404, 409, 500 e falha de conexão/timeout, usando a mensagem da API quando existe.
