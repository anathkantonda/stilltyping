import { db } from '@/db'
import { auth } from '@/lib/auth'
import { user } from '@/db/auth-schema'
import { eq } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { Effect, pipe } from 'effect'

export const Route = createFileRoute('/_authenticated/onboarding/username')({
  component: RouteComponent,
})

const UsernameSchema = z.object({
  username: z.string().min(3).max(15).regex(/^[a-zA-Z0-9_]+$/),
})

const setUsername = createServerFn({ method: 'POST' })
  .inputValidator(UsernameSchema)
  .handler(({ data }) =>
    pipe(
      Effect.promise(() => auth.api.getSession()),
      Effect.flatMap(session =>
        session
          ? pipe(
            Effect.promise(() =>
              db
                .select()
                .from(user)
                .where(eq(user.username, data.username))
                .limit(1)
                .execute()
            ),
            Effect.flatMap(existing =>
              existing.length === 0
                ? Effect.promise(() =>
                  db
                    .update(user)
                    .set({ username: data.username })
                    .where(eq(user.id, session.user.id))
                )
                : Effect.fail(new Error('Username already taken'))
            )
          )
          : Effect.fail(new Error('Not authenticated'))
      ),
      Effect.runPromise
    )
  )

function RouteComponent() {
  const [newUsername, setNewUsername] = useState('')
  const navigate = Route.useNavigate()

  const handleSetUsername = () => {
    setUsername({ data: { username: newUsername } })
      .then(() => navigate({ to: '/dashboard' }))
      .catch(error => alert(error.message))
  }

  return (
    <div>
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button onClick={handleSetUsername}>
        Set Username
      </button>
    </div>
  )
}