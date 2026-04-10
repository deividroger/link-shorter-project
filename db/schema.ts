import {
  pgTable,
  integer,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const links = pgTable('links', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 20 }).unique().notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Link = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;
