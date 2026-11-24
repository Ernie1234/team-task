# AGENT.md: Team Task monorepo

One git repository, run with Bun workspaces and Turborepo:

- `apps/api` (`@team-task/api`): API (Bun, Express, MongoDB, Socket.IO). Read `apps/api/AGENT.md`.
- `apps/web` (`@team-task/web`): web app (React, Vite, TypeScript). Read `apps/web/AGENT.md`.
- `packages/*`: shared workspace packages (none yet).

## Commands (repo root)

```bash
bun install            # one bun.lock for the whole repo; never add lockfiles in apps
bun run dev            # both apps
bun run typecheck      # every app
bun run lint
bun run build
```

Before finishing a change, run `typecheck` (and `lint` and `build` for the web app) from the root.

## Imports

No relative imports (`./`, `../`); ESLint fails on them in every package.

- Inside `apps/web` and `apps/api`: the `@/` alias for `src/`, e.g. `@/lib/utils`, `@/services/task-service`.
- Inside `packages/shared`: `#shared/…`, e.g. `#shared/validation/helpers` (set in its `package.json` `imports`). It can't use `@/`, because the apps compile shared's source and `@/` would resolve to the app's `src/`.
- Between packages: the package name, e.g. `@team-task/shared/validation`.

## Dependencies

- Add a dependency to the app that uses it: `cd apps/web && bun add <pkg>`.
- Shared enums, Zod schemas and response types live in `packages/shared` (`@team-task/shared`); never redefine them in an app. Request body types are the `z.input` of the API's schemas, so the web and the API can't drift.
- Every package has `typecheck`, `lint` and `test` scripts where they apply; `bun run test` runs them all (tests use `bun:test`).

## Git

Commit messages follow Conventional Commits, with **no** co-author trailers or AI attribution. Use the app as the scope when it helps (`fix(api): …`, `feat(web): …`) or the feature area from the app's AGENT.md. Tick off finished features in the READMEs when pushing.
