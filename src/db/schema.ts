import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'
export * from "./auth-schema"

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  post: varchar('post', { length: 140 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})