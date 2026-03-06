# Tasks: Dashboard 3D de Contribuições Ipê City

**Input**: Design documents from `/specs/001-ipe-city-dashboard/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Incluídos conforme Constitution (TDD e testes de integração). Contrato de dados e fluxos críticos de UI cobertos.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/public/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per plan.md: frontend/ (src/components, src/data, src/scene, public/data), tests/ (e2e, integration, unit)
- [x] T002 Initialize frontend with Vite + TypeScript + React: frontend/package.json, frontend/vite.config.ts, frontend/tsconfig.json, frontend/index.html
- [x] T003 [P] Add dependencies in frontend/package.json: react, react-dom, three, @react-three/fiber, @react-three/drei
- [x] T004 [P] Configure ESLint and Prettier in frontend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data layer and contract; MUST be complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create seed data file frontend/public/data/seed.json with 15 projects, 20 developers, and contributions array per specs/001-ipe-city-dashboard/contracts/seed-data.md
- [x] T006 [P] Define TypeScript types for Project, Developer, Contribution and SeedData in frontend/src/data/types.ts
- [x] T007 Implement data loader (fetch/import seed.json, validate shape, return typed data) in frontend/src/data/loader.ts
- [x] T008 [P] Contract test: validate seed.json shape and loader output (15 projects, 20 devs, referential integrity) in tests/integration/data-contract.test.ts

**Checkpoint**: Foundation ready — data loads; contract test passes. User story implementation can begin.

---

## Phase 3: User Story 1 - Visualizar cidade 3D dos repositórios (Priority: P1) 🎯 MVP

**Goal**: User sees a 3D city where each building is a project, with name on top and height proportional to total contributions.

**Independent Test**: Open app in browser; 3D scene shows 15 buildings with visible names and distinct heights; no errors in console.

### Implementation for User Story 1

- [x] T009 [US1] Create R3F Canvas and basic scene (lighting, camera) in frontend/src/App.tsx or frontend/src/scene/Scene.tsx
- [x] T010 [US1] Implement Building component: geometry (box) with height derived from project.totalContributions, position from grid index, in frontend/src/components/Building.tsx
- [x] T011 [US1] Add project name label on top of each building (text or sprite) in frontend/src/components/Building.tsx or frontend/src/components/BuildingLabel.tsx
- [x] T012 [US1] Implement City component: map projects from loader to grid of Building components in frontend/src/components/City.tsx
- [x] T013 [US1] Add OrbitControls (from @react-three/drei) for camera rotate/zoom in frontend/src/scene/ or App
- [x] T014 [US1] E2E test: page loads, city with buildings is visible and project names appear (tests/e2e/dashboard.spec.ts)

**Checkpoint**: User Story 1 complete — city 3D with 15 buildings and names; independently testable.

---

## Phase 4: User Story 2 - Consultar contribuições por projeto e por desenvolvedor (Priority: P2)

**Goal**: Tooltip on building hover; side panel (toggle) with project and developer lists; click on building selects project and updates panel.

**Independent Test**: Hover building → tooltip shows name and total contributions; open panel → see projects and developers; click building → panel shows that project's details.

### Implementation for User Story 2

- [x] T015 [US2] Tooltip on building hover: show project name and totalContributions in frontend/src/components/Tooltip.tsx (or inline in Building)
- [x] T016 [US2] SidePanel component with open/close toggle button in frontend/src/components/SidePanel.tsx
- [x] T017 [US2] SidePanel content: list all projects with total contributions; list all developers with total contributions (from loader/aggregates) in frontend/src/components/SidePanel.tsx
- [x] T018 [US2] On building click: set selected project id in app state and show project details (name, total, contributors) in SidePanel in frontend/src/components/SidePanel.tsx and frontend/src/App.tsx
- [x] T019 [US2] Wire selected project state (e.g. React state or context) so Building highlight and SidePanel detail stay in sync in frontend/src/App.tsx

**Checkpoint**: User Stories 1 and 2 work: city, tooltip, panel toggle, click-to-select and panel update.

---

## Phase 5: User Story 3 - Acesso público pela internet (Priority: P3)

**Goal**: Page is a static asset deployable to a public URL; no auth required.

**Independent Test**: Run production build; serve dist/ and open in browser; page loads and city is visible (or deploy to host and open URL).

### Implementation for User Story 3

- [ ] T020 [US3] Ensure production build script (e.g. npm run build) outputs static assets to frontend/dist/ and seed.json is included in public assets
- [ ] T021 [US3] Add deploy configuration for static hosting (e.g. vercel.json, netlify.toml, or GitHub Pages workflow) at repo root or frontend/

**Checkpoint**: App can be deployed and accessed via public URL.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases and validation

- [ ] T022 Run quickstart.md validation: npm install, npm run dev, npm run build from frontend/ per specs/001-ipe-city-dashboard/quickstart.md
- [ ] T023 [P] Edge case: show clear message or empty state when no projects (or zero contributions) in frontend/src/components/City.tsx or App
- [ ] T024 [P] Edge case: truncate or wrap long project names on building label in frontend/src/components/Building.tsx or BuildingLabel.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–5)**: Depend on Foundational
  - US1 (Phase 3) first for MVP
  - US2 (Phase 4) builds on US1 (same app, adds tooltip/panel)
  - US3 (Phase 5) build and deploy after US1+US2
- **Polish (Phase 6)**: After desired user stories complete

### User Story Dependencies

- **US1**: After Phase 2 — no dependency on US2/US3
- **US2**: After Phase 2 and US1 (needs city and data)
- **US3**: After Phase 2; build/deploy can follow US1 or US2

### Within Each User Story

- Data/types before loader; loader before scene
- Scene and Building before City; City before E2E
- Components before wiring state

### Parallel Opportunities

- T003 and T004 (Setup)
- T006 and T008 (types and contract test) after T005
- T009, T010, T011 can be sequenced (scene → Building → label)
- T022, T023, T024 (Polish)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Load page, see city with 15 buildings and names  
5. Deploy/demo if desired  

### Incremental Delivery

1. Setup + Foundational → data and contract ready  
2. Add US1 → city 3D → test independently  
3. Add US2 → tooltip, panel, click → test independently  
4. Add US3 → build and deploy → public URL  
5. Polish → edge cases and quickstart check  

---

## Notes

- [P] = different files, no blocking dependencies
- [USn] maps task to user story for traceability
- Commit after each task or logical group
- Validate at each checkpoint before moving on
