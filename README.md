# Team Task

**A real-time workspace for teams: tasks, chat, notes and calendar in one app.**

This is the Team Task monorepo, run with [Bun workspaces](https://bun.sh/docs/install/workspaces) and [Turborepo](https://turborepo.com).

| Path | What it is | Docs |
| --- | --- | --- |
| `apps/web` | Web app: React, TypeScript, Vite | [README](apps/web/README.md) (features, roadmap, screenshots) |
| `apps/api` | API: Bun, Express 5, MongoDB, Socket.IO | [README](apps/api/README.md) (endpoints, environment variables) |
| `packages/shared` | `@team-task/shared`: enums, Zod schemas and response types used by both apps | `src/{enums,validation,types}` |

The git history of both former repos ([team-task_frontend](https://github.com/Ernie1234/team-task_frontend) and [team-task_backend](https://github.com/Ernie1234/team-task_backend)) is kept here, with each file at its new path.

## Getting started

**Prerequisites:** [Bun](https://bun.sh) 1.3+, a MongoDB database and a Google OAuth client (see the [API README](apps/api/README.md#environment-variables)).

```bash
bun install                                   # installs every app (one bun.lock)
cp apps/api/.env.example apps/api/.env        # then fill in the values
cp apps/web/.env.example apps/web/.env
bun run dev                                   # API on :3000, web on :5173
```

## Scripts

Run from the repo root. Turborepo runs the task in every app that has it and caches the results.

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the API and web app together |
| `bun run dev:api` / `bun run dev:web` | Start one app |
| `bun run build` | Production build of every app |
| `bun run typecheck` | Type-check every package |
| `bun run lint` | Lint every app |
| `bun run test` | Run the unit tests (`bun:test`) |

To run a command in one app: `bun run --filter @team-task/web <script>`, or `cd` into the app.
