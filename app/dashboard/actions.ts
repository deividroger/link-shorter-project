'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { createLink, updateLink, deleteLink } from '@/data/links';

const createLinkSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (val) => {
        try {
          const { protocol } = new URL(val);
          return protocol === 'http:' || protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL must use http or https protocol' },
    ),
  slug: z
    .string()
    .max(20, 'Slug must be 20 characters or less')
    .regex(
      /^[a-z0-9-]*$/,
      'Slug may only contain lowercase letters, numbers, and hyphens',
    )
    .optional(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const userProvidedSlug = parsed.data.slug;

  if (userProvidedSlug) {
    try {
      await createLink({ url: parsed.data.url, slug: userProvidedSlug, userId });
    } catch {
      return { error: 'Slug already taken. Please choose a different one.' };
    }
  } else {
    const MAX_RETRIES = 5;
    let inserted = false;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const slug = nanoid(8);
      try {
        await createLink({ url: parsed.data.url, slug, userId });
        inserted = true;
        break;
      } catch {
        if (attempt === MAX_RETRIES - 1) {
          return { error: 'Failed to generate a unique slug. Please try again.' };
        }
      }
    }
    if (!inserted) {
      return { error: 'Failed to generate a unique slug. Please try again.' };
    }
  }

  revalidatePath('/dashboard');
  return { success: true };
}

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (val) => {
        try {
          const { protocol } = new URL(val);
          return protocol === 'http:' || protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL must use http or https protocol' },
    ),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await updateLink(parsed.data.id, userId, { url: parsed.data.url });
  } catch {
    return { error: 'Failed to update link.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await deleteLink(parsed.data.id, userId);
  } catch {
    return { error: 'Failed to delete link.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
