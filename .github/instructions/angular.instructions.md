---
applyTo: '**/*.{ts,html}'
---

# Angular review focus

- Prefer signals and Signal Forms; do not push RxJS subjects for local UI state.
- Flag missing colocated `.spec.ts` or e2e updates when templates/public APIs change.
- Do not nitpick Tailwind class order or PrimeNG import paths when they are valid standalone imports.
