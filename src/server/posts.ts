import { createServerFn, createMiddleware } from '@tanstack/react-start'
import { db } from '@/db'
import { posts, user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq, desc } from 'drizzle-orm'
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';

const postSchema = z.object({
    post: z.string().min(1).max(140)
})

const authMiddleware = createMiddleware()
    .server(async ({ next }) => {
        const req = getRequest();
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session) {
            throw new Error("Unauthorized");
        }

        return next({
            context: {
                user: session.user,
            },
        });
    });

export const getPostsWithUsers = createServerFn({ method: 'GET' })
  .handler(async () => {
    return db
      .select({
        id: posts.id,
        content: posts.post,
        username: user.username,
      })
      .from(posts)
      .leftJoin(user, eq(posts.userId, user.id))
      .orderBy(desc(posts.createdAt))
      .limit(20)
  })

export const createPost = createServerFn({ method: 'POST' })
.middleware([authMiddleware])
.inputValidator(postSchema)
.handler(async ({data, context}) => {
  await db.insert(posts).values({
    userId: context.user.id,
    post: data.post,
  }).returning();
})