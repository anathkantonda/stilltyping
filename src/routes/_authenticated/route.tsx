import { useSession, signOut } from '@/lib/auth-client';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react';
import type { AppUser } from '@/types/auth'

export const Route = createFileRoute('/_authenticated')({
  component: AuthLayout,
})

function AuthLayout() {
  const { data: session, isPending } = useSession()
  const navigate = Route.useNavigate();
  const user = session?.user as AppUser | undefined

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: '/login' })
      return
    }

    if (user && !user.username) {
      navigate({ to: '/onboarding/username' })
    }
  }, [isPending, session, navigate])

  if (isPending) return <p className="text-7xl">Loading...</p>

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/' });
        },
      },
    });
  };

  return (
    <div>
      <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
        Sign Out
      </button>
      <Outlet />
    </div>
  )
}
