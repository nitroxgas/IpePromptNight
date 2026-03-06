# Data Model: Dashboard 3D Ipê City

**Feature**: 001-ipe-city-dashboard  
**Date**: 2025-03-05

## Overview

O MVP usa dados estáticos (JSON) com 15 projetos e 20 desenvolvedores. A métrica de contribuição é composta: commits + PRs (somados ou ponderados). Cada projeto é representado por uma edificação cuja altura é proporcional ao total de contribuições do repositório.

## Entities

### Project (Projeto / Repositório)

Representa um repositório da organização Ipê City.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Identificador único do projeto (ex.: slug do repo). |
| name | string | Nome exibido no topo da edificação e no painel. |
| totalContributions | number | Soma (ou métrica ponderada) de commits + PRs para este repositório; determina a altura da edificação. |

**Validation**: `id` e `name` obrigatórios; `totalContributions` ≥ 0. Nomes longos podem ser truncados na UI (edge case da spec).

**Relationships**: Um projeto tem muitas contribuições por desenvolvedor (matriz projeto × desenvolvedor).

---

### Developer (Desenvolvedor)

Representa um contribuidor.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Identificador único (ex.: login ou nome normalizado). |
| name | string | Nome exibido no painel lateral. |

**Validation**: `id` e `name` obrigatórios.

**Relationships**: Um desenvolvedor tem contribuições em um ou mais projetos.

---

### Contribution (Contribuição)

Métrica composta (commits + PRs) por par (projeto, desenvolvedor). Usada para altura do prédio (agregada por projeto) e para exibição no painel por projeto e por desenvolvedor.

| Field | Type | Description |
|-------|------|-------------|
| projectId | string | Referência a Project.id. |
| developerId | string | Referência a Developer.id. |
| commits | number | Quantidade de commits (ou 0). |
| pullRequests | number | Quantidade de PRs (ou 0). |
| total | number | Valor usado na UI: commits + PRs (ou ponderado). Deve ser consistente com a fórmula escolhida (ex.: commits + PRs). |

**Validation**: `projectId` e `developerId` devem existir em `projects` e `developers`. Valores numéricos ≥ 0.

**Aggregates**:
- Por projeto: soma de `total` de todas as contribuições do projeto = `Project.totalContributions` (altura da edificação).
- Por desenvolvedor: soma de `total` por projeto ou total geral para exibir no painel.

---

## Dataset shape (MVP)

O payload estático (ex.: `seed.json`) pode seguir uma das formas:

**Option A – Normalized**
- `projects: Project[]`
- `developers: Developer[]`
- `contributions: Contribution[]`

**Option B – Denormalized for display**
- `projects: Array<Project & { contributionsByDeveloper: { developerId: string, total: number }[] }>`
- `developers: Array<Developer & { contributionsByProject: { projectId: string, total: number }[] } | totalContributions: number>`

A implementação pode escolher Option A e agregar em memória, ou Option B para evitar cálculo no carregamento. O contrato em `contracts/` descreve o formato adotado.

## State (UI)

- **Selected project**: id do projeto selecionado por clique na edificação; drive do conteúdo do painel lateral.
- **Side panel open/closed**: boolean (toggle).
- **View state**: câmera, rotação, zoom (geridos pela cena 3D).

Não há persistência de estado no MVP (apenas em memória na sessão).
