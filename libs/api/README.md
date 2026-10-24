# api

Thin HTTP client and models for the NASA/JPL Scout candidate list (`ScoutApiService`, `ScoutCandidate`). Responses are validated with **Zod** (`ScoutApiResponseSchema`) before they leave the API layer. No UI or store logic — filtering/search belong in `stores-scout`.

```sh
npx nx test api
```
