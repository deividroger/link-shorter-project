---
description: Read this before implementing or modifying server actions in the project.
---

# Server Actions

All data mutations in this app must be done via **Server Actions**. No Route Handlers or direct database calls from components.

## Rules

- **Server Actions only.** Never mutate data from client components directly or via Route Handlers.
- **Called from Client Components only.** Server Actions must always be invoked from a Client Component (`"use client"`).
- **File naming and colocation.** Server Action files must be named `actions.ts` and placed in the same directory as the Client Component that calls them.
- **No `FormData`.** All data passed to Server Actions must use explicit TypeScript types — never the `FormData` type.
- **Validate with Zod.** Every Server Action must validate its input using a Zod schema before any business logic or database operations.
- **Auth check first.** Every Server Action must call `await auth()` and verify `userId` before performing any database operation.
- **Use `/data` helpers.** Database operations must go through the helper functions in the `/data` directory. Never use Drizzle queries directly inside a Server Action.
- **Never throw errors.** Server Actions must not throw. Instead, return a typed object with either a `success` property or an `error` property (string message).

## Example

```ts
// app/dashboard/actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLink } from '@/data/links';

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid input' };

  await createLink({ ...parsed.data, userId });
  return { success: true };
}
```
