import { auth } from '@clerk/nextjs/server';
import db from '@/db';
import { links } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { type Link, type NewLink } from '@/db/schema';

export async function getUserLinks(): Promise<Link[]> {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

export async function createLink(
  data: Omit<NewLink, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<void> {
  await db.insert(links).values(data);
}

export async function updateLink(
  id: number,
  userId: string,
  data: Pick<NewLink, 'url'>,
): Promise<void> {
  const rows = await db
    .update(links)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({ id: links.id });
  if (rows.length === 0) throw new Error('Link not found or access denied');
}

export async function deleteLink(id: number, userId: string): Promise<void> {
  const rows = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({ id: links.id });
  if (rows.length === 0) throw new Error('Link not found or access denied');
}

export async function getLinkBySlug(slug: string): Promise<Link | undefined> {
  const results = await db
    .select()
    .from(links)
    .where(eq(links.slug, slug))
    .limit(1);
  return results[0];
}
