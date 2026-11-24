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

## Dependencies

- Add a dependency to the app that uses it: `cd apps/web && bun add <pkg>`.
- The apps use different major versions of some packages (zod 3 in web, zod 4 in api). `apps/web/tsconfig.app.json` maps `zod` to the web app's copy so type-only imports from libraries resolve correctly.

## Git

Commit messages follow Conventional Commits, with **no** co-author trailers or AI attribution. Use the app as the scope when it helps (`fix(api): …`, `feat(web): …`) or the feature area from the app's AGENT.md. Tick off finished features in the READMEs when pushing.
