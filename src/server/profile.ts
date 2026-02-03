import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { user, posts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const usernameSchema = z.object({
  username: z.string(),
})

export const getProfileAndPosts = createServerFn({ method: 'GET' })
.inputValidator(usernameSchema)
.handler(async ({ data }) => {
    const profile = await db
    .select({
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
    })
    .from(user)
    .where(eq(user.username, data.username))
    .limit(1)

    if(!profile.length){
        return null
    }

    const userPosts = await db
    .select({
        id: posts.id,
        content: posts.post,
        createdAt: posts.createdAt,
    })
    .from(posts)
    .where(eq(posts.userId, profile[0].id))
    .orderBy(desc(posts.createdAt))

    return {
        profile: profile[0],
        posts: userPosts,
    }
  })