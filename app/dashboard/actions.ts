'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { createLink, updateLink, deleteLink } from '@/data/links';

const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  slug: z.string().max(20, 'Slug must be 20 characters or less').regex(/^[a-z0-9-]*$/, 'Slug may only contain lowercase letters, numbers, and hyphens').optional(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(
  input: CreateLinkInput
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = parsed.data.slug || nanoid(8);

  try {
    await createLink({ url: parsed.data.url, slug, userId });
  } catch {
    return { error: 'Slug already taken. Please choose a different one.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url('Please enter a valid URL'),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLinkAction(
  input: UpdateLinkInput
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
  input: DeleteLinkInput
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await deleteLink(parsed.data.id, userId);

  revalidatePath('/dashboard');
  return { success: true };
}
