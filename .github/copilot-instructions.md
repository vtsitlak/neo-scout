# NEO Scout — Copilot code review

Focus on correctness, security, and regressions. Do **not** comment on style, formatting, import order, or naming that Format/Lint already enforce.

## Do not comment on

- Prettier/ESLint/formatting, unused imports, or trivial renames
- Suggesting `BehaviorSubject` for component UI state
- Suggesting classic `@Input` / `@Output` / constructor DI when signals/`inject()` are used
- Suggesting `FormBuilder` / reactive forms when Signal Forms are appropriate
- Suggesting `ag-grid-enterprise` or PrimeNG 22+ without an explicit licence requirement
- Branch naming or commit message style

## Only comment when

- A clear bug, broken edge case, or incorrect API usage is present
- Security risk: secrets in source, unsafe HTML, auth/authz holes
- Missing or outdated unit/e2e coverage for a changed user-visible contract
- Nx boundary / path-alias violations (deep relative imports across libs)
- Production-impacting performance issues (obvious N+1, unbounded lists without virtualization where required)

## Stack expectations (accept these)

- Standalone Angular, `OnPush`, signals, `inject()`, `@if` / `@for` / `@switch`
- Tailwind for layout; PrimeNG 21 (MIT) for controls; AG Grid **Community** + `themeQuartz`
- NgRx SignalStore for shared state; Playwright e2e under `apps/*-e2e`
- Branches: `{type}/{issue}-{short-slug}` from `develop` (`ci/` for pipelines, never `chore/`)
