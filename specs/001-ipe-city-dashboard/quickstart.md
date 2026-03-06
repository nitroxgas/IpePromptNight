# Quickstart: Dashboard 3D Ipê City

**Feature**: 001-ipe-city-dashboard

## Prerequisites

- Node.js 18+
- npm ou pnpm

## Setup

1. Na raiz do repositório (branch `001-ipe-city-dashboard`):

   ```bash
   cd frontend
   npm install
   ```

2. Garantir que exista o arquivo de dados fictícios:
   - `frontend/public/data/seed.json` com 15 projetos, 20 desenvolvedores e lista de contribuições (ver `specs/001-ipe-city-dashboard/contracts/seed-data.md`).

## Run (development)

```bash
cd frontend
npm run dev
```

Abrir no browser a URL indicada (ex.: `http://localhost:5173`). A página MUST exibir a cidade 3D e permitir rotação/zoom, tooltip ao passar o mouse na edificação, clique para selecionar e atualizar o painel lateral, e toggle do painel.

## Build (production)

```bash
cd frontend
npm run build
```

Saída em `frontend/dist/`. Servir com qualquer host de arquivos estáticos (ex.: `npx serve dist`).

## Validate

- **Dados**: O JSON de seed deve validar contra o contrato em `specs/001-ipe-city-dashboard/contracts/seed-data.md` (15 projetos, 20 devs, integridade referencial).
- **Critérios de sucesso**: Ver `spec.md` (SC-001 a SC-004): carga &lt; 10 s, nomes e alturas corretos, dados por projeto/desenvolvedor no painel, funcionamento em um browser desktop moderno).

## Deploy (acesso público)

Fazer deploy da pasta `frontend/dist/` em Vercel, Netlify ou GitHub Pages para cumprir FR-006 (página acessível pela internet). Configuração exata depende do provedor.
