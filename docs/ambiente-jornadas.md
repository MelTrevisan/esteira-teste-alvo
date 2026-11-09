# Ambiente para a aba Jornadas

Preencha o formulário "Ambiente do projeto" (botão "Aprovar ambiente") assim.
Stack do projeto: back Node, front Vue com Vuetify, banco PostgreSQL. Gerenciador npm 10, Node 22
(fixados pela plataforma; não há campo na tela).

| Campo | Valor |
|---|---|
| Pasta do back | `api` |
| Pasta do front | `web` |
| Script de migração | `migrate` |
| Script de seed (opcional) | `seed` |
| Script que sobe o back | `start` |
| Script que gera o front | `build` |
| Porta do back | `3000` |
| Prefixo da API | `/api` |
| Caminho de prontidão | `/api/health` |
| Pasta dos estáticos do front | `dist` |
| Variável da URL do banco | `DATABASE_URL` |
| Variável da porta (opcional) | `PORT` |
| Variável da origem (opcional) | deixe vazio (o app não usa) |
| Variável de segredo aleatório (opcional) | deixe vazio (o app não usa) |

Depois, em "Iniciar uma rodada", cole o conteúdo de `docs/plano-jornadas.json` (ou, para ver uma
rodada com jornada vermelha, `docs/plano-com-falha.json`).

## Observações

- O app deve estar na branch padrão do repositório do alvo, com `api/package-lock.json` e `web/package-lock.json`
  versionados (a plataforma instala com `npm ci --ignore-scripts`).
- As jornadas abrem só `/` e navegam por cliques (o servidor estático da plataforma pode não ter
  fallback de SPA). O build também gera `eventos/index.html` e `eventos/novo/index.html`.
- O plano não tem campo "opcional": a jornada J-099 do `plano-com-falha.json` só traz "OPCIONAL" no título.
- Jornada J-004 depende do e-mail fixo do dicionário (`pessoa.teste@exemplo.invalid`) e roda no evento 3 (criado pelo seed, ids 1 a 3 num banco novo).
  J-002 usa o evento 2.
