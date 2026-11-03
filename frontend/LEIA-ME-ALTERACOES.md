# Matrículas institucionais automáticas

Dois projetos atualizados: `controle-academico` (Spring Boot) e `controle-academico-frontend` (React).

- Alunos: `2026A000001`; professores: `2026P000002` (exemplos). O ano é obtido no servidor e o número vem de uma tabela de sequência global, criada automaticamente pelo JPA. O contador é compartilhado entre os dois tipos, então pode haver saltos entre as matrículas de um tipo.
- POST de aluno: `{ "nome": "João", "email": "joao@exemplo.com", "cursoId": 1 }`.
- POST de professor: `{ "nome": "Ana", "email": "ana@exemplo.com" }`.
- A matrícula é gerada somente no cadastro e nunca é atualizada, mesmo que um cliente mande `matriculaInstitucional` no corpo da requisição.
- Os DTOs mantêm a matrícula na resposta, mas ela deixa de ser obrigatória na entrada.
- Frontend não solicita matrícula em cadastros/edições; mostra o identificador nos detalhes/listas e informa sua geração automática nos formulários.
- `spring.jpa.hibernate.ddl-auto` foi mudado de `create` para `update`, **pois `create` apaga e recria tabelas ao iniciar**. Para ambientes reais, recomenda-se migração versionada (Flyway/Liquibase) e backups.
- **Antes da primeira execução**, faça backup do MySQL. O modo `update` não reconstitui dados já perdidos por inicializações anteriores em `create`.
- Se já existem alunos/professores com matrícula manual, eles mantêm os números existentes; os novos recebem o novo formato. Se a sequência já existia e foi apagada externamente, ou se números nesse formato já foram atribuídos manualmente, é necessário reconciliar o contador antes de cadastrar novos registros.
- A nova tabela `sequencia_matricula` deve existir e possuir um ID auto-incremental. Com a configuração de desenvolvimento `ddl-auto=update`, o Hibernate a criará na inicialização.
- Rodar backend e frontend separadamente (`npm install` e `npm run dev` no frontend). Configurar CORS, se necessário, para a origem mostrada pelo Vite.
