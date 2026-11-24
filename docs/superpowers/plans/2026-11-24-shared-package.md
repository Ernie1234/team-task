# Shared Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `packages/shared` (`@team-task/shared`), which holds the enums, Zod schemas and response types, and switch `apps/api` and `apps/web` to it.

**Architecture:** A source-only TypeScript workspace package. `exports` point straight at `.ts` files, so there is no build step. The API's schemas move in without their Mongoose imports. The web app's hand-written response types move in. The web app upgrades to Zod 4 so both apps share one Zod.

**Tech Stack:** Bun 1.3 workspaces, Turborepo 2, TypeScript 5.9, Zod 4, `bun:test` for the package's tests, React Hook Form with `@hookform/resolvers` 5.

**Spec:** `docs/superpowers/specs/2026-11-24-shared-package-design.md`

## Global Constraints

- Package name `@team-task/shared`, `"private": true`, `"type": "module"`, no build step. `exports` are `"."`, `"./enums"`, `"./validation"` and `"./types"`, each pointing at `src/**/index.ts`.
- `packages/shared` must not import `mongoose`, `express`, `react`, `socket.io-client` or anything from `apps/*`. Its only runtime dependency is `zod` `^4.5.4`, the API's current range.
- Ids are checked with `/^[0-9a-fA-F]{24}$/`.
- Conventional Commits, author `Ernie1234 <anumahjoshuaeneye@gmail.com>`, no co-author or AI lines.
- After every task, `bun run typecheck` at the repo root passes. Once Task 4 is done, `bun run lint` and `bun run build` pass too.

## Review Focus

1. **A 12-character string as an id:** Mongoose accepted it; it must now be rejected. Pinned in Task 1, `objectId`.
2. **Clearing a task's due date with `""` or `null`:** it must still parse to `null`. Pinned in Task 2, `task.test.ts`.
3. **Unknown keys in update bodies:** they must still be rejected (`.strict()` survives the move). Pinned in Task 2, `user.test.ts` and `task.test.ts`.
4. **A web form submitting an empty optional description (`""`):** it must pass the shared schema. Pinned in Task 2, `workspace.test.ts` and `project.test.ts`.
5. **Sign-up and reset passwords under 8 characters, and a reset where "confirm" doesn't match:** both must be rejected on the field the user sees. Pinned in Task 4, `auth.test.ts`.

---

### Task 1: Scaffold `packages/shared` with enums and helpers

**Files:**
- Create: `packages/shared/package.json`, `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`, `src/enums/index.ts`, `src/enums/task.ts`, `src/enums/role.ts`
- Create: `packages/shared/src/validation/helpers.ts`, `src/validation/index.ts`, `src/types/index.ts` (empty barrel for now)
- Test: `packages/shared/src/validation/helpers.test.ts`, `src/enums/enums.test.ts`
- Modify: `turbo.json` (add a `test` task with `"outputs": []`), root `package.json` (add `"test": "turbo run test"`)
- Modify: `apps/api/package.json`, `apps/web/package.json` (add `"@team-task/shared": "workspace:*"`)

**Interfaces:**
- Produces from `@team-task/shared/enums`: `TaskStatusEnum`, `TaskPriorityEnum`, `TaskStatusEnumType`, `TaskPriorityEnumType`, `Roles`, `RoleType`, `Permissions`, `PermissionType`. Copy the values exactly from `apps/api/src/enums/task-enum.ts` and `role-enum.ts`, keeping the `as const` object style.
- Produces from `@team-task/shared/validation`: `OBJECT_ID_RE: RegExp`, `objectId(label?: string): z.ZodString` (error message `Invalid ${label ?? ""} ID.` trimmed of double spaces), `isValidTimeZone(tz: string): boolean`, `NOTE_VISIBILITY` (`["private", "workspace"] as const`), `NoteVisibility`.
- The package's scripts are `"typecheck": "tsc --noEmit -p ."` and `"test": "bun test"`. Its dev dependencies are `typescript ~5.9.2` and `@types/bun`.

- [ ] **Step 1: Write the failing tests**

```ts
// helpers.test.ts
import { expect, test } from "bun:test";
import { objectId, isValidTimeZone } from "./helpers";
test("objectId accepts a 24-char hex id", () => {
  expect(objectId("task").safeParse("64b7f0c2a1b2c3d4e5f60718").success).toBe(true);
});
test("objectId rejects a 12-char string that mongoose allowed", () => {
  expect(objectId("task").safeParse("abcdefghijkl").success).toBe(false);
});
test("isValidTimeZone", () => {
  expect(isValidTimeZone("Africa/Lagos")).toBe(true);
  expect(isValidTimeZone("Mars/Olympus")).toBe(false);
});
// enums.test.ts
test("task status values", () => {
  expect(Object.values(TaskStatusEnum)).toEqual(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
});
```

- [ ] **Step 2:** Create the package files. Run `bun install` at the root, then `cd packages/shared && bun test`. Expected: the tests fail because the modules are missing.
- [ ] **Step 3:** Implement the enums and helpers, plus the barrels. `src/index.ts` re-exports enums, validation and types.
- [ ] **Step 4:** At the root, run `bun run test` and `bun run typecheck`. Expected: all pass, with 3 typecheck tasks (api, web, shared).
- [ ] **Step 5: Commit** `build(shared): add @team-task/shared with enums and id helpers`

### Task 2: Move the API's schemas into shared and switch the API

**Files:**
- Create in `packages/shared/src/validation/`: `calendar.ts`, `chat.ts`, `invite-code.ts`, `note.ts`, `notification.ts`, `project.ts`, `task.ts`, `user.ts`, `workspace.ts`. Each is moved from `apps/api/src/validation/<name>-validation.ts` with the same export names, and re-exported from `validation/index.ts`.
- Test: `packages/shared/src/validation/{task,user,workspace,project}.test.ts`
- Delete: `apps/api/src/validation/`, `apps/api/src/enums/task-enum.ts`, `apps/api/src/enums/role-enum.ts`
- Modify: every API file that imports `@/validation/*`, `./../validation/*`, `@/enums/task-enum` or `@/enums/role-enum`. They now import from `@team-task/shared/validation` or `@team-task/shared/enums`. `apps/api/src/models/note-model.ts` imports `NOTE_VISIBILITY` and `NoteVisibility` from shared and stops defining them.
- Keep in the API: `enums/errorCode.enum.ts`, `enums/account-provider-enum.ts`, `utils/zoned-time.ts` (its `isValidTimeZone` becomes a re-export from shared).

**Interfaces:**
- Consumes from Task 1: `objectId`, `isValidTimeZone`, `NOTE_VISIBILITY`, `TaskStatusEnum`, `TaskPriorityEnum`.
- Produces: every export listed in the spec's source files, unchanged in name and shape. For example: `createWorkspaceSchema`, `updateWorkspaceSchema`, `createProjectSchema`, `updateProjectSchema`, `createTaskBodySchema`, `updateTaskBodySchema`, `taskParamsSchema`, `appearanceSchema`, `AppearanceType`, `emailPrefsSchema`, `updateProfileSchema`, `createNoteSchema`, `createEventSchema`, `sendMessageSchema`, `inviteCodeSchema`.
- The local `objectId` helpers in `note`, `calendar` and `task` are replaced by the shared `objectId`. Calls of `mongoose.isValidObjectId` go away.

- [ ] **Step 1: Write the failing tests**

```ts
// task.test.ts
test("dueDate '' and null clear the date", () => {
  expect(updateTaskBodySchema.parse({ dueDate: "" }).dueDate).toBeNull();
  expect(updateTaskBodySchema.parse({ dueDate: null }).dueDate).toBeNull();
});
test("update rejects unknown keys", () => {
  expect(updateTaskBodySchema.safeParse({ title: "x", hacked: true }).success).toBe(false);
});
test("params reject a 12-char id", () => {
  expect(taskParamsSchema.safeParse({ workspaceId: "abcdefghijkl", projectId: "64b7f0c2a1b2c3d4e5f60718" }).success).toBe(false);
});
// user.test.ts
test("appearance is strict", () => {
  expect(appearanceSchema.safeParse({ ...validAppearance, extra: 1 }).success).toBe(false);
});
test("emailPrefs rejects an unknown time zone", () => {
  expect(emailPrefsSchema.safeParse({ timeZone: "Mars/Olympus" }).success).toBe(false);
});
// workspace.test.ts / project.test.ts
test("empty description is accepted", () => {
  expect(createWorkspaceSchema.safeParse({ name: "Team", description: "" }).success).toBe(true);
});
```
If `updateTaskBodySchema` isn't `.strict()` today, drop the unknown-keys test and note it in the commit body; don't change behaviour.

- [ ] **Step 2:** In `packages/shared`, run `bun test`. Expected: the new tests fail because the imports are missing.
- [ ] **Step 3:** Move the schemas, then rewrite the API's imports. To find them, run `grep -rn "validation/\|enums/task-enum\|enums/role-enum" apps/api/src`.
- [ ] **Step 4:** At the root, run `bun run test` and `bun run typecheck`. Then run `bun run dev:api` and check that `curl localhost:3000/health/ready` returns 200. Expected: everything passes.
- [ ] **Step 5: Commit** `refactor(api): use shared zod schemas and enums`

### Task 3: Move the web's response types into shared

**Files:**
- Create in `packages/shared/src/types/`: `user.ts` (`UserType`, `EmailPrefs`, `DEFAULT_EMAIL_PREFS`, `CurrentUserResponseType`, `LoginResponseType`, `loginType`, `registerType`), `workspace.ts`, `project.ts`, `task.ts`, `note.ts`, `calendar.ts`, `activity.ts` (notifications, activities, analytics, dashboard), `chat.ts` (all of `apps/web/src/types/chat.type.ts`, plus `ChatType`, `Message`, `MessageAttachment`, `NewMessageEvent`, `OnlineUser`, `PresenceUpdate`, `TypingUser` from `apps/web/src/lib/socket.ts`), `notification.ts` (from `notification.type.ts`), `appearance.ts` (`Appearance = AppearanceType`, `Mode`, `Radius`), and `index.ts`.
- Modify: `apps/web/src/types/api.type.ts`, `chat.type.ts` and `notification.type.ts` become one-line re-exports, `export * from "@team-task/shared/types"`, so the ~100 existing imports keep working. `custom-error.type.ts` stays in web because it's axios-specific.
- Modify: `apps/web/src/lib/socket.ts` and `apps/web/src/lib/appearance.ts` import those types from shared and re-export them. `DEFAULT_APPEARANCE` and the CSS logic stay in web.
- Modify: `apps/web/src/constant/index.ts` becomes `export * from "@team-task/shared/enums"`.

**Interfaces:**
- Consumes: `AppearanceType` (Task 2), and `NoteVisibility`, `TaskStatusEnumType`, `TaskPriorityEnumType`, `PermissionType` (Task 1).
- Produces: every type name currently exported from `apps/web/src/types/{api,chat,notification}.type.ts`, with the same name and shape.

- [ ] **Step 1:** Move the types. Replace the `import("@/lib/appearance")` and `@/constant` references inside them with shared imports.
- [ ] **Step 2:** At the root, run `bun run typecheck`. Expected: pass. A shape mismatch between the web's `Appearance` and `AppearanceType` gets fixed in the shared type, never with a cast.
- [ ] **Step 3:** Run `grep -rn "from \"react\"\|socket.io-client\|@/" packages/shared/src`. Expected: no output.
- [ ] **Step 4: Commit** `refactor(web): use shared response types and enums`

### Task 4: Web on Zod 4, forms on shared schemas

**Files:**
- Create: `packages/shared/src/validation/auth.ts` exporting `signInSchema` (email, password min 1), `signUpSchema` (name, email, password min 8), `verifyEmailSchema` (`otp`, length 6), `forgotPasswordSchema` (email), `resetPasswordSchema` (`otp`, `password` min 8, `confirm`, with a refine on `confirm` whose message is `"Passwords don't match"` and whose path is `["confirm"]`). Use the copy from the current web forms. Add the `*Input` types.
- Test: `packages/shared/src/validation/auth.test.ts`
- Modify: `apps/web/package.json`. Set `zod` to `^4.5.4` and `@hookform/resolvers` to `^5`.
- Modify: `apps/web/tsconfig.app.json`. Remove the `zod` path mapping and its comment.
- Modify the 10 form files in `apps/web/src` that import `zod`. Auth pages use the `auth.ts` schemas. Workspace, project and task forms use `createWorkspaceSchema`/`updateWorkspaceSchema`, `createProjectSchema.pick({ name, description, emoji })` and `createTaskBodySchema`, extended with any form-only fields, such as a `Date` for the date picker.
- Modify: the root `AGENT.md`. Delete the zod-versions note and add: "Shared enums, Zod schemas and response types live in `packages/shared`; never redefine them in an app."

**Interfaces:**
- Consumes: the schemas from Task 2.
- Produces: `signInSchema`, `signUpSchema`, `verifyEmailSchema`, `forgotPasswordSchema`, `resetPasswordSchema` and their `*Input` types, for the mobile app later.

- [ ] **Step 1: Write the failing tests**

```ts
test("sign-up password needs 8 characters", () => {
  const r = signUpSchema.safeParse({ name: "A", email: "a@b.co", password: "short" });
  expect(r.success).toBe(false);
});
test("reset confirm must match, error on confirm", () => {
  const r = resetPasswordSchema.safeParse({ otp: "123456", password: "longenough", confirm: "different" });
  expect(r.success).toBe(false);
  expect(r.error!.issues[0].path).toEqual(["confirm"]);
});
```

- [ ] **Step 2:** Run `bun test` in `packages/shared`. Expected: fail.
- [ ] **Step 3:** Implement `auth.ts`, upgrade the web's dependencies (`bun install` at the root), and switch the forms. Use `useForm<z.input<typeof s>, unknown, z.output<typeof s>>` where resolvers 5 needs it.
- [ ] **Step 4:** At the root, run `bun run test`, `bun run typecheck`, `bun run lint` and `bun run build`. Expected: all pass, and lint shows only the 4 known warnings. Running `bun pm ls | grep zod` shows one major version, 4.
- [ ] **Step 5: Commit** `refactor(web): move to zod 4 and shared form schemas`

### Task 5: Check it in the browser and update the docs

**Files:**
- Modify: `README.md` (add `packages/shared` to the table and `bun run test` to the scripts), `apps/web/README.md` and `apps/api/README.md` (roadmap), `apps/web/AGENT.md` and `apps/api/AGENT.md` (validation and types now come from `@team-task/shared`).

- [ ] **Step 1:** Run `bun run dev`. In the browser, sign in, then create a workspace, a project and a task (with and without a due date), and edit the task to clear its due date. Also submit the sign-up form with a 5-character password and check that the error shows on the field. Expected: everything works, with no console errors.
- [ ] **Step 2:** Update the roadmap. In `apps/web/README.md`, change the line `- [ ] Shared packages in the monorepo: types, Zod validation and API client…` into a ticked `- [x] Shared package: enums, Zod validation and types (@team-task/shared)` plus an unticked `- [ ] Shared API client package for the web and mobile apps`. Mirror this in `apps/api/README.md`.
- [ ] **Step 3: Commit** `docs: describe @team-task/shared and update the roadmap`
