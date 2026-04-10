---
description: Read this before implementing or modifying authentication in the project.
---

# Authentication

All authentication in this app is handled exclusively by **Clerk v7**. No other auth libraries or custom auth implementations should ever be used.

## Rules

- **Clerk only.** Do not use NextAuth, custom JWT logic, sessions, or any other auth mechanism.
- **Sign in and sign up must always open as a modal** — use the `mode="modal"` prop on `<SignInButton>` and `<SignUpButton>`.
- **`/dashboard` is a protected route.** Users who are not signed in must not be able to access it.
- **Redirect signed-in users away from `/`.** If a logged-in user visits the homepage, redirect them to `/dashboard`.
- **Every Server Action and Route Handler** that reads or writes user data must call `await auth()` and verify `userId` before proceeding.

## Route Protection

Use Clerk middleware (`clerkMiddleware`) in `middleware.ts` to enforce route protection. Mark `/dashboard` (and any sub-routes) as protected using `createRouteMatcher`.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

## Homepage Redirect for Signed-In Users

In `app/page.tsx`, use `auth()` to check sign-in state and redirect to `/dashboard`:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  // ...render landing page
}
```

## Sign In / Sign Up Modals

Always pass `mode="modal"` to Clerk's button components:

```tsx
<SignInButton mode="modal" />
<SignUpButton mode="modal" />
```

## Accessing the Current User

- **Server components / Server Actions:** `const { userId } = await auth();` from `@clerk/nextjs/server`
- **Client components:** `useAuth()` or `useUser()` hooks from `@clerk/nextjs`

## Disclaimers

 The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy