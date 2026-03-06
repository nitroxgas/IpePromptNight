<!--
Sync Impact Report (2025-03-05)
- Version change: (none) → 1.0.0 (initial creation)
- Modified principles: N/A (new constitution)
- Added sections: Core Principles (5), Additional Constraints, Development Workflow, Governance
- Removed sections: N/A
- Templates: plan-template.md ✅ (Constitution Check gate aligns); spec-template.md ✅; tasks-template.md ✅
- Follow-up TODOs: None
-->

# IpePromptNight Constitution

## Core Principles

### I. Library-First

Every feature starts as a standalone library. Libraries MUST be self-contained, independently
testable, and documented. Clear purpose is required—no organizational-only libraries.
Rationale: Enables reuse, testability, and clear boundaries.

### II. CLI Interface

Every library exposes functionality via CLI. Text in/out protocol: stdin/args → stdout;
errors → stderr. Support JSON and human-readable formats where applicable.
Rationale: Scriptability and debuggability without custom tooling.

### III. Test-First (NON-NEGOTIABLE)

TDD is mandatory: tests written → user approved → tests fail → then implement. The
Red-Green-Refactor cycle MUST be strictly enforced.
Rationale: Prevents regressions and ensures requirements are executable.

### IV. Integration Testing

Focus areas requiring integration tests: new library contract tests, contract changes,
inter-service communication, and shared schemas. These MUST be covered before release.
Rationale: Catches integration failures that unit tests cannot.

### V. Observability, Versioning & Simplicity

- **Observability**: Text I/O ensures debuggability; structured logging is required for
  operational code.
- **Versioning**: Use MAJOR.MINOR.BUILD format; document breaking changes.
- **Simplicity**: Start simple; apply YAGNI. Complexity MUST be justified in design docs.
Rationale: Maintainability and safe evolution over time.

## Additional Constraints

- Technology choices MUST align with the implementation plan (language, framework, storage).
- Security-sensitive code MUST have explicit requirements in the spec and tests.
- Performance and scale constraints MUST be stated in the spec when they apply.

## Development Workflow

- All work flows from spec → plan → tasks. No implementation without an approved spec.
- Code review MUST verify compliance with this constitution.
- Each feature branch MUST reference its spec and plan in the repo (e.g. under `specs/`).

## Governance

This constitution supersedes ad-hoc practices. Amendments require: (1) documented proposal,
(2) approval, (3) migration plan for existing work. All PRs and reviews MUST verify
compliance. Use project README and `.specify/` docs for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-03-05 | **Last Amended**: 2025-03-05
