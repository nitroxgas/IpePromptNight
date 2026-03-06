# Implementation Plan: Dashboard 3D de Contribuições Ipê City

**Branch**: `001-ipe-city-dashboard` | **Date**: 2025-03-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-ipe-city-dashboard/spec.md`

## Summary

Dashboard web que exibe uma cidade 3D (estilo Git City) onde cada edificação representa um repositório da organização Ipê City, com altura proporcional à métrica composta de contribuições (commits + PRs). O usuário vê tooltip ao passar o mouse, clica na edificação para selecionar e atualizar o painel lateral (toggle), e consulta contribuições por projeto e por desenvolvedor. MVP com dados fictícios (15 projetos, 20 devs), SPA estática em TypeScript + React + React Three Fiber + Three.js, build com Vite, deploy estático para acesso público.

## Technical Context

**Language/Version**: TypeScript 5.x (target ES2020+), Node 18+ para tooling  
**Primary Dependencies**: React 18, React Three Fiber (R3F), Three.js, Vite  
**Storage**: N/A (dados estáticos em JSON no frontend para MVP)  
**Testing**: Vitest (unit/component), Playwright (E2E)  
**Target Platform**: Browser desktop (Chrome, Firefox, Edge, Safari); mobile com degradação aceitável  
**Project Type**: Web application (frontend SPA; sem backend no MVP)  
**Performance Goals**: Cena 3D fluida (60 fps alvo), carga da página &lt; 10 s em conexão típica (SC-001)  
**Constraints**: 15 projetos e 20 desenvolvedores no dataset fictício; sem API externa no MVP  
**Scale/Scope**: 1 página (dashboard); 15 edificações; painel lateral com listas/filtros por projeto e desenvolvedor  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|--------|
| I. Library-First | Pass | Core de visualização 3D e camada de dados como módulos testáveis e reutilizáveis. |
| II. CLI Interface | Deferred | Produto é uma SPA web; CLI não se aplica à interface do usuário. Script opcional para gerar/validar seed data (JSON) pode ser adicionado como “CLI” do projeto. |
| III. Test-First | Pass | TDD aplicado à lógica de dados e componentes; testes de integração para fluxos críticos (tooltip, clique, painel). |
| IV. Integration Testing | Pass | Testes de integração para contrato dos dados (shape do JSON) e fluxo UI (seleção, painel). |
| V. Observability & Simplicity | Pass | Logging estruturado em dev; simplicidade: SPA estática, sem backend no MVP. |

## Project Structure

### Documentation (this feature)

```text
specs/001-ipe-city-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (data shape / JSON schema)
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/      # React components (City, Building, SidePanel, etc.)
│   ├── data/           # Loader for static JSON, types
│   ├── scene/          # R3F scene, camera, controls
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── data/
│       └── seed.json    # 15 projects, 20 devs (fictitious)
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json

tests/
├── e2e/                 # Playwright
│   └── dashboard.spec.ts
├── integration/
│   └── data-contract.test.ts
└── unit/
    └── ...              # Data logic, components
```

**Structure Decision**: Frontend-only SPA. A pasta `frontend/` contém a aplicação Vite+React; dados fictícios em `public/data/seed.json`. Testes em `tests/` na raiz (ou sob `frontend/` conforme convenção do projeto). Sem pasta `backend/` no MVP.

## Complexity Tracking

> Nenhuma violação que exija justificativa adicional; CLI deferido para produto web-only.

| Item | Justificativa |
|------|----------------|
| CLI não implementado no MVP | Produto é uma SPA acessível por URL; princípio II atendido por script de seed opcional ou deferido. |
