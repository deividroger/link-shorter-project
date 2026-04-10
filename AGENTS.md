<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions

This project is a link shortener built with Next.js 16, React 19, Clerk v7, Drizzle ORM, and Neon PostgreSQL.

All coding standards, conventions, and patterns for this project are documented in the `/docs` directory.

> [!CAUTION]
> **BLOCKING REQUIREMENT: You MUST read every relevant `/docs` file in full BEFORE generating ANY code, making ANY edit, or proposing ANY solution.** This is non-negotiable and applies without exception — even for small changes. Do not write a single line of code until you have read the applicable doc(s). Failure to do so will result in incorrect, non-compliant output.

## Instruction Docs

- [Authentication](docs/auth.md) — Clerk-only auth, protected routes, modals, redirects
- [UI Components](docs/ui.md) — shadcn/ui only, no custom components, CLI usage

**How to determine which docs apply:** If your task touches auth, sessions, protected routes, or user data → read `docs/auth.md`. If your task touches any UI, components, or styling → read `docs/ui.md`. When in doubt, read both.

## Non-Negotiable Rules

1. **Read the docs first — always.** Reading the relevant `/docs` file(s) is your FIRST action, before any code generation, file editing, or planning. No exceptions.
2. **App Router only.** Never use Pages Router patterns.
3. **TypeScript only.** All files must be `.ts` or `.tsx`.
4. **Never use `middleware.ts`.** The Next.js middleware convention (`middleware.ts`) is deprecated in the version of Next.js used by this project. All request interception, auth guards, and route matching logic must go in `proxy.ts` instead.
4. **Authenticate every mutation.** Every Server Action and Route Handler that reads or writes user data must verify `userId` via `await auth()`.
5. **Never expose secrets.** `CLERK_SECRET_KEY`, `DATABASE_URL`, and any other server-only secrets must never reach client-side code.
6. **Use the `cn()` helper** for all conditional class name merging — never string concatenation.
7. **Do not hand-edit `components/ui/`** — these files are managed by the shadcn CLI.
8. **Do not edit files in `drizzle/`** — these are auto-generated migration files.
