# Shared package (`@team-task/shared`): design

Roadmap item: "Shared packages in the monorepo: types, Zod validation and API client". This is step 1 of 2; the API client is step 2.

## Why

The web app, the API and the coming Expo app should use one copy of the enums, validation and types, so they can't drift. Today the API has 9 Zod schema files, the web app writes its own schemas in 10 forms, the task/role/permission enums are defined twice, and the web app's ~600 lines of response types are hand-written in `apps/web/src/types`.

## Goals

- One package, `packages/shared` (`@team-task/shared`), used by `apps/api` and `apps/web`, and ready for `apps/mobile`.
- Enums, Zod schemas (with inferred input types) and response types live only there.
- Both apps on Zod 4.

## Non-goals

- The API client (step 2, `packages/api-client`).
- Runtime validation of API responses.
- The mobile app.

## Anti-goals

- No behaviour change beyond the two listed below.
- No build or watch step added to `bun run dev`.

## Approaches

- **Source-only TS package (chosen).** `exports` point at `.ts` files. Bun runs them, Vite compiles them, Metro handles TS in workspace packages. Nothing to build.
- **Built package (tsup → JS + `.d.ts`).** Only worth it for publishing to npm, and it adds a build-watch step to dev.
- **TS project references without a package.** Wouldn't give Expo a package to import, and it couples the tsconfigs.

## Design

```
packages/shared/
  package.json   name @team-task/shared, private, type module, dependency zod ^4
                 exports: ".", "./enums", "./validation", "./types" → src/*.ts
  tsconfig.json  strict, bundler resolution, noEmit; script "typecheck"
  src/
    enums/       task status/priority, roles, permissions
    validation/  the API's 9 schema files + auth schemas (sign-in, sign-up, reset)
                 objectId helper (24-char hex regex), isValidTimeZone, NOTE_VISIBILITY
    types/       the web's response types + Appearance + socket Message types
    index.ts
```

- **API:** imports enums and schemas from `@team-task/shared`. `src/validation` and the shared enum files are deleted; API-only enums (error codes, account provider) stay. The schemas must not import Mongoose or API code.
- **Web:** Zod 4 and `@hookform/resolvers` 5. Forms use the shared schemas, using `.extend`/`.pick` for form-only fields. `@/constant` and `@/types/*.type.ts` re-export from shared or are replaced. The `zod` path mapping in `tsconfig.app.json` is removed.

## Behaviour changes (accepted)

1. Id validation is a 24-char hex regex. Mongoose's `isValidObjectId` also accepted any 12-char string.
2. Forms that switch to a shared schema show the API's error messages.

## Done when

- `bun run typecheck`, `bun run lint` and `bun run build` pass from the root.
- Both apps start, and in the browser, sign-in plus creating a workspace, project and task work.
- The roadmap is updated in both READMEs, and AGENT.md is updated.

## Left to the builder

- File layout inside `validation/` and `types/`, and which response types move as-is or get tidied.
- Whether `@/constant` becomes a re-export or its imports are rewritten.
