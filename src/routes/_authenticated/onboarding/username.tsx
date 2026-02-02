import { db } from '@/db'
import { auth } from '@/lib/auth'
import { user } from '@/db/auth-schema'
import { eq } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { Effect, pipe } from 'effect'
import { getRequest } from '@tanstack/react-start/server'

export const Route = createFileRoute('/_authenticated/onboarding/username')({
  component: RouteComponent,
})

const UsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be 15 characters or less')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Only letters, numbers, and underscores are allowed'
    ),
})

const setUsername = createServerFn({
  method: 'POST'
})
  .inputValidator(UsernameSchema)
  .handler(({ data }) =>
    pipe(
      Effect.promise(() => {
        const event = getRequest()

        if (!event) {
          throw new Error('No request event')
        }

        return auth.api.getSession({
          headers: event.headers,
        })
      }),
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
                ).pipe(
                  Effect.as({ success: true })
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
  const [error, setError] = useState<string | null>(null)
  const navigate = Route.useNavigate()

  const handleChange = (value: string) => {
    setNewUsername(value)

    const result = UsernameSchema.safeParse({ username: value })

    if (!result.success) {
      setError(result.error.issues[0].message)
    } else {
      setError(null)
    }
  }

  const handleSetUsername = () => {
    if (error || newUsername.length === 0) return

    setUsername({ data: { username: newUsername } })
      .then(() => navigate({ to: '/dashboard' }))
      .catch(err => setError(err.message))
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <h3 className="text-3xl">Welcome :)</h3>
      <div className="flex flex-col gap-1 w-72">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            @
          </span>

          <input
            type="text"
            value={newUsername}
            onChange={(e) => handleChange(e.target.value)}
            className="border px-2 py-2 pl-8 w-full rounded-md"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {!error && newUsername.length >= 3 && (
          <p className="text-sm text-green-600">
            Username looks good
          </p>
        )}
      </div>

      <button
        onClick={handleSetUsername}
        disabled={!!error || newUsername.length < 3}
        className="border px-3 py-3 bg-black text-white cursor-pointer rounded-md disabled:opacity-50"
      >
        Set Username
      </button>
    </div>
  )
}