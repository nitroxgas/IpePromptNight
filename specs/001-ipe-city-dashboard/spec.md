# Feature Specification: Dashboard 3D de Contribuições Ipê City

**Feature Branch**: `001-ipe-city-dashboard`  
**Created**: 2025-03-05  
**Status**: Draft  
**Input**: Dashboard web que monitore contribuições nos repositórios da organização Ipê City; visualização 3D em forma de cidade (estilo Git City); cada edificação = projeto com nome no topo e altura proporcional às contribuições; dados de contribuição por desenvolvedor e por projeto; página acessível pela internet; MVP com dados fictícios.

## Clarifications

### Session 2025-03-05

- Q: O que conta como uma unidade de contribuição (para altura e métricas)? → A: Métrica composta (commits + PRs somados ou ponderados).
- Q: Como o usuário acessa dados de contribuição por projeto e por desenvolvedor? → A: Tooltip ao passar o mouse na edificação + painel lateral para detalhes por projeto/desenvolvedor.
- Q: Clique na edificação deve selecionar o projeto e refletir no painel? → A: Sim: clique na edificação seleciona o projeto e atualiza o painel lateral com seus detalhes.
- Q: Escala dos dados fictícios no MVP (quantos projetos e desenvolvedores)? → A: 15 projetos, 20 devs.
- Q: Painel lateral deve estar sempre visível ou pode abrir/fechar? → A: Pode abrir/fechar (toggle); usuário controla a visibilidade.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar cidade 3D dos repositórios (Priority: P1)

Como visitante do site, quero ver uma cidade 3D onde cada prédio ou casa representa um projeto da organização Ipê City, com o nome do projeto no topo e a altura proporcional à quantidade de contribuições do repositório, para entender rapidamente quais projetos têm mais atividade.

**Why this priority**: É o valor central do produto—a metáfora visual “cidade” e a leitura imediata de contribuição por projeto.

**Independent Test**: Acessar a página pela internet e ver a cena 3D com pelo menos um edificação por repositório, nomes visíveis e alturas distintas; pode ser validado com dados fictícios.

**Acceptance Scenarios**:

1. **Given** a página do dashboard carregada, **When** o usuário acessa pela URL pública, **Then** a cena 3D é exibida com edificações representando projetos.
2. **Given** a cena 3D, **When** o usuário observa cada edificação, **Then** o nome do projeto aparece no topo e a altura reflete a quantidade de contribuições daquele repositório.
3. **Given** múltiplos repositórios com contribuições diferentes, **When** a cidade é renderizada, **Then** as alturas das edificações variam de forma proporcional às contribuições.

---

### User Story 2 - Consultar contribuições por projeto e por desenvolvedor (Priority: P2)

Como visitante, quero poder acessar dados de contribuição tanto por projeto (total por repositório) quanto por desenvolvedor, via tooltip ao passar o mouse na edificação e via painel lateral com detalhes, para analisar quem contribui e onde.

**Why this priority**: Atende ao requisito explícito de “manter dados de contribuição dos desenvolvedores e também dos projetos”.

**Independent Test**: Verificar que, ao passar o mouse numa edificação, um tooltip exibe dados do projeto; que um painel lateral (abrir/fechar por toggle) permite consultar contribuições por projeto e por desenvolvedor; e que clique na edificação atualiza o painel, usando dados fictícios no MVP.

**Acceptance Scenarios**:

1. **Given** a cidade 3D, **When** o usuário passa o mouse sobre uma edificação, **Then** um tooltip exibe o nome do projeto e o total de contribuições daquele repositório.
2. **Given** a página com painel lateral, **When** o usuário consulta por projeto ou por desenvolvedor, **Then** o painel exibe as contribuições (por repositório ou totais) de forma legível.
4. **Given** a cidade 3D, **When** o usuário clica numa edificação, **Then** o projeto é selecionado e o painel lateral é atualizado com os detalhes daquele projeto (contribuições e, se aplicável, desenvolvedores).
3. **Given** dados fictícios no MVP, **When** o usuário navega pela aplicação (tooltip e painel), **Then** as métricas exibidas são consistentes com esses dados.

---

### User Story 3 - Acesso público pela internet (Priority: P3)

Como qualquer pessoa com internet, quero acessar o dashboard por uma URL pública, sem necessidade de VPN ou rede interna, para compartilhar e divulgar a atividade da organização.

**Why this priority**: Requisito explícito—“deve ser uma página acessível pela internet”.

**Independent Test**: Abrir a URL do dashboard em um navegador a partir de uma rede externa (ou simulando) e confirmar que a página carrega e a cidade 3D é visível.

**Acceptance Scenarios**:

1. **Given** o dashboard implantado, **When** um usuário acessa a URL em um navegador conectado à internet, **Then** a página carrega e o conteúdo principal (cidade 3D) é exibido.
2. **Given** a página carregada, **When** não há autenticação exigida para visualização, **Then** o usuário pode ver a cidade e os dados de contribuição (MVP com dados fictícios) sem login.

---

### Edge Cases

- O que acontece quando não há repositórios ou contribuições? Exibir cidade vazia ou mensagem clara; altura mínima ou indicador “sem dados”.
- Como o sistema se comporta em telas pequenas ou dispositivos móveis? A experiência 3D pode ser degradada (mensagem ou layout alternativo) sem quebrar o acesso.
- O que acontece se os dados de contribuição forem zero para um projeto? Edificação com altura mínima ou valor padrão, sem erro.
- Como tratar nomes de projetos muito longos? Truncar ou quebrar no topo da edificação de forma legível.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma visualização 3D em forma de cidade onde cada edificação representa um repositório/projeto da organização Ipê City.
- **FR-002**: O sistema MUST exibir o nome de cada projeto no topo da edificação correspondente.
- **FR-003**: O sistema MUST definir a altura de cada edificação de forma proporcional à quantidade de contribuições do repositório que ela representa.
- **FR-004**: O sistema MUST manter e exibir dados de contribuição agregados por projeto (por repositório), via tooltip ao passar o mouse na edificação e via painel lateral.
- **FR-005**: O sistema MUST manter e exibir dados de contribuição por desenvolvedor (por repositório ou totais) no painel lateral.
- **FR-005a**: O sistema MUST permitir clicar numa edificação para selecionar o projeto e atualizar o painel lateral com os detalhes desse projeto.
- **FR-005b**: O sistema MUST permitir abrir e fechar (toggle) o painel lateral; a visibilidade é controlada pelo usuário.
- **FR-006**: O sistema MUST ser acessível como página web pela internet (URL pública, sem exigência de rede interna para visualização).
- **FR-007**: Para o MVP, o sistema MUST poder operar com dados fictícios de contribuições: 15 projetos e 20 desenvolvedores, sem dependência de API real de repositórios.
- **FR-008**: A experiência visual MUST ser inspirada no conceito Git City (cidade 3D com edificações representando repositórios e altura ligada à atividade).

### Key Entities

- **Projeto/Repositório**: Representa um repositório da organização; atributos relevantes: nome, quantidade de contribuições (para altura e métricas); no MVP pode ser apenas nome e valor fictício.
- **Desenvolvedor**: Representa um contribuidor; atributos relevantes: identificador (ex.: nome ou login), contribuições por projeto ou totais; no MVP dados fictícios.
- **Contribuição**: Métrica composta (commits + PRs, somados ou ponderados) por repositório e por desenvolvedor; usada para altura das edificações e para consultas por projeto/desenvolvedor.

## Assumptions

- “Organização Ipê City” é o contexto de negócio; no MVP não é obrigatório integrar com API real (ex.: GitHub); dados fictícios cobrem 15 projetos e 20 desenvolvedores.
- “Contribuição” é métrica composta: commits + PRs (somados ou com pesos definidos na implementação), agregável por repositório e por desenvolvedor.
- A página é somente leitura para visitantes; não há edição de dados nem autenticação no escopo do MVP.
- Acessibilidade pela internet implica que o dashboard será hospedado em um ambiente acessível por URL pública (hosting a ser definido no plano técnico).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário consegue carregar a página do dashboard pela internet e ver a cidade 3D em até 10 segundos em conexão típica.
- **SC-002**: Todas as edificações exibidas correspondem a projetos com nome visível no topo e altura proporcional às contribuições (verificável com conjunto de dados fictícios conhecido).
- **SC-003**: O usuário consegue obter, pela interface, o total de contribuições por projeto e por desenvolvedor para os dados exibidos (MVP com dados fictícios).
- **SC-004**: A página funciona em pelo menos um navegador desktop moderno (Chrome, Firefox, Edge ou Safari) sem erros que impeçam a visualização da cidade 3D.
