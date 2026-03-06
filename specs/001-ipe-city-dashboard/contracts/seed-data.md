# Contract: Seed Data (MVP)

**Feature**: 001-ipe-city-dashboard  
**Consumers**: Frontend (loader de dados)  
**Format**: JSON estático (arquivo ou módulo)

## Purpose

Define o formato dos dados fictícios usados no MVP (15 projetos, 20 desenvolvedores). O frontend MUST carregar e interpretar este contrato para renderizar a cidade 3D e o painel lateral.

## Schema (structure)

### Root

```json
{
  "projects": [ { ... } ],
  "developers": [ { ... } ],
  "contributions": [ { ... } ]
}
```

### Project

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Identificador único (ex.: repo slug). |
| name | string | yes | Nome exibido no topo da edificação. |
| totalContributions | number | yes | Métrica composta (commits + PRs) para altura do prédio; ≥ 0. |

### Developer

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Identificador único. |
| name | string | yes | Nome exibido no painel. |

### Contribution

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| projectId | string | yes | Deve existir em `projects[].id`. |
| developerId | string | yes | Deve existir em `developers[].id`. |
| commits | number | yes | ≥ 0. |
| pullRequests | number | yes | ≥ 0. |

O valor exibido por par (projeto, desenvolvedor) é `commits + pullRequests` (ou fórmula ponderada definida na implementação). A soma por `projectId` deve coincidir com `Project.totalContributions` para consistência da altura.

## Constraints

- **Scale MVP**: Exatamente 15 elementos em `projects` e 20 em `developers`. `contributions` cobre pelo menos uma entrada por par (projeto, desenvolvedor) que tenha contribuição &gt; 0 (não é obrigatório preencher todos os 15×20).
- **Referential integrity**: Todo `projectId` em `contributions` existe em `projects`; todo `developerId` em `contributions` existe em `developers`.
- **Consistency**: Para cada projeto, a soma de `(commits + pullRequests)` em `contributions` para esse `projectId` MUST igualar `projects[i].totalContributions` (ou a fórmula adotada).

## Example (minimal)

```json
{
  "projects": [
    { "id": "repo-a", "name": "Repo A", "totalContributions": 120 },
    { "id": "repo-b", "name": "Repo B", "totalContributions": 85 }
  ],
  "developers": [
    { "id": "dev-1", "name": "Alice" },
    { "id": "dev-2", "name": "Bob" }
  ],
  "contributions": [
    { "projectId": "repo-a", "developerId": "dev-1", "commits": 70, "pullRequests": 10 },
    { "projectId": "repo-a", "developerId": "dev-2", "commits": 30, "pullRequests": 10 },
    { "projectId": "repo-b", "developerId": "dev-1", "commits": 50, "pullRequests": 5 }
  ]
}
```

## Versioning

- **v1**: Formato acima. Alterações incompatíveis (novos campos obrigatórios, remoção de campos) devem incrementar versão e ser documentadas aqui.
