<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

This project is a link shortener built with Next.js 16, React 19, Clerk v7, Drizzle ORM, and Neon PostgreSQL.

## Non-Negotiable Rules

1. **Read the docs first — always.** Reading the relevant `/docs` file(s) is your FIRST action, before any code generation, file editing, or planning. No exceptions.
2. **App Router only.** Never use Pages Router patterns.
3. **TypeScript only.** All files must be `.ts` or `.tsx`.
4. **Never use `middleware.ts`.** The Next.js middleware convention (`middleware.ts`) is deprecated in the version of Next.js used by this project. All request interception, auth guards, and route matching logic must go in `proxy.ts` instead.
5. **Authenticate every mutation.** Every Server Action and Route Handler that reads or writes user data must verify `userId` via `await auth()`.
6. **Never expose secrets.** `CLERK_SECRET_KEY`, `DATABASE_URL`, and any other server-only secrets must never reach client-side code.
7. **Use the `cn()` helper** for all conditional class name merging — never string concatenation.
8. **Do not hand-edit `components/ui/`** — these files are managed by the shadcn CLI.
9. **Do not edit files in `drizzle/`** — these are auto-generated migration files.
