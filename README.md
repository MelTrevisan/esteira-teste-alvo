# Eventos GX2 Demo

App de demonstração da GX2: cadastro de eventos e inscrição de participantes. Todos os dados são
fictícios. Serve de alvo para a demonstração das jornadas Playwright da plataforma.

- `web/`: Vue 3 + Vuetify (Vite). Telas: lista de eventos, novo evento, detalhe do evento e inscrição.
- `api/`: Node puro (`http`) com `pg`. Rotas em `/api` (`/api/health`, `/api/eventos`, `/api/eventos/:id`,
  `/api/eventos/:id/inscricoes`).
- Banco: PostgreSQL. Sem login.
- Dois diretórios independentes, sem workspaces: cada um tem o próprio `package.json` e `package-lock.json` (npm 10, Node 22).

## Rodar localmente

```bash
# banco (exemplo)
docker run -d --name eventos-pg -e POSTGRES_PASSWORD=demo -e POSTGRES_DB=demo -p 5432:5432 postgres:16-alpine
export DATABASE_URL=postgres://postgres:demo@localhost:5432/demo

cd api && npm ci --ignore-scripts && npm run migrate && npm run seed && npm start   # porta 3000 (ou PORT)
cd web && npm ci --ignore-scripts && npm run dev                                    # http://localhost:5173, repassa /api
```

`npm run build` no `web/` gera `web/dist` (estáticos). A API só responde `/api`; quem serve o `dist`
e repassa `/api` ao back é o servidor da plataforma (ou o proxy do `vite dev`).

## Scripts

| Pasta | Script | O que faz |
|---|---|---|
| `api` | `migrate` | cria as tabelas (idempotente) |
| `api` | `seed` | cria 3 eventos fictícios, só se não houver evento |
| `api` | `start` | sobe a API na `PORT` |
| `web` | `build` | gera `web/dist` |

## Jornadas

`docs/plano-jornadas.json` (4 jornadas), `docs/plano-com-falha.json` (uma jornada que falha de propósito)
e `docs/ambiente-jornadas.md` (o que preencher em "Aprovar ambiente"). Os campos digitáveis e botões
usados têm `data-testid` estável.
