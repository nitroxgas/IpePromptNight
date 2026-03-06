# Research: Dashboard 3D Ipê City

**Feature**: 001-ipe-city-dashboard  
**Date**: 2025-03-05

## 1. Stack para visualização 3D no browser

**Decision**: Three.js (via React Three Fiber para integração com UI) ou Three.js puro.

**Rationale**: Git City e projetos similares usam Three.js; é o padrão de fato para WebGL no browser, boa documentação e performance. React Three Fiber (R3F) permite integrar a cena 3D com React (painel lateral, estado de seleção) sem reescrever tudo em vanilla. Para MVP, R3F reduz boilerplate de controle de câmera e eventos.

**Alternatives considered**:
- Three.js puro: mais controle, mais código; adequado se não houver framework UI.
- Babylon.js: alternativa sólida; ecossistema menor que Three.js para exemplos “city”.
- WebGL puro: custo de desenvolvimento alto para o prazo do MVP.

**Recommendation**: TypeScript + React + React Three Fiber + Three.js para MVP; build com Vite.

---

## 2. Dados e “backend” no MVP

**Decision**: Dados estáticos em JSON no frontend (arquivo ou módulo); sem backend nem API real.

**Rationale**: A spec exige “dados fictícios para o MVP” e “sem dependência de API real”. Um único JSON com 15 projetos e 20 desenvolvedores (e contribuições compostas commits+PRs) atende; pode ser importado como módulo ou fetch de arquivo estático.

**Alternatives considered**:
- Backend mínimo (Node/Express) servindo JSON: adia complexidade; não necessário para MVP.
- Mock API (MSW, json-server): útil para testes; dados ainda podem ser estáticos no build.

---

## 3. Formato dos dados fictícios

**Decision**: Um único JSON com estrutura: lista de projetos (id, name, totalContributions, contributionsByDeveloper?), lista de desenvolvedores (id, name, contributionsByProject ou total), e/ou matriz projeto×desenvolvedor para contribuições.

**Rationale**: Altura da edificação = total de contribuições do projeto (métrica composta commits+PRs). Painel exibe por projeto e por desenvolvedor; o formato deve permitir ambos os agrupamentos. Estrutura normalizada (projetos, desenvolvedores, contribuições) ou aninhada conforme conveniência do frontend.

**Alternatives considered**:
- CSV: menos adequado para relações N:N (projeto–desenvolvedor).
- Múltiplos JSON (projetos.json, devs.json): possível; um único payload simplifica carregamento no MVP.

---

## 4. Hospedagem e acesso público

**Decision**: Deploy estático (Vite build → HTML/JS/CSS e assets) em provedor de hosting estático (Vercel, Netlify, GitHub Pages ou similar).

**Rationale**: Spec exige “página acessível pela internet”; SPA estática atende. Sem backend no MVP, qualquer host de arquivos estáticos serve. Vercel/Netlify oferecem HTTPS e URL pública por padrão.

**Alternatives considered**:
- Servidor próprio: desnecessário para MVP.
- GitHub Pages: gratuito, integração direta com repositório.

---

## 5. Testes (TDD / Constitution)

**Decision**: Vitest para unit/component; Playwright ou React Testing Library para integração/E2E da página (cena 3D, tooltip, painel, toggle).

**Rationale**: Constitution exige TDD e testes de integração. Lógica de dados (cálculo de totais, métrica composta) e componentes de UI (painel, lista) são testáveis com Vitest. Interação 3D (hover, clique) pode ser coberta por testes de integração/E2E com Playwright.

**Alternatives considered**:
- Jest: Vitest é mais rápido e compatível com Vite.
- Cypress: Playwright é mais leve para um único dashboard.

---

## 6. Acessibilidade da cena 3D

**Decision**: MVP foca em desktop; cena 3D com rotação/zoom por mouse; em mobile aceitar degradação (mensagem ou layout alternativo), conforme edge cases da spec.

**Rationale**: Spec já prevê “experiência 3D pode ser degradada em telas pequenas”. Git City e similares são usados principalmente em desktop. Acessibilidade (leitura de tela para a cidade 3D) fica como melhoria pós-MVP; painel lateral e textos devem ser acessíveis (semântica, contraste).

---

## Resumo de decisões

| Tópico            | Decisão                                      |
|-------------------|----------------------------------------------|
| 3D no browser     | Three.js + React Three Fiber (R3F)           |
| Linguagem / build | TypeScript, Vite                             |
| Dados MVP         | JSON estático (15 projetos, 20 devs)         |
| Backend MVP       | Nenhum; SPA estática                         |
| Hospedagem        | Deploy estático (Vercel / Netlify / GH Pages)|
| Testes            | Vitest (unit/component), Playwright (E2E)    |
| Acessibilidade 3D | Desktop first; mobile degradado              |
