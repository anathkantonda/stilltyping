import { useSession, signOut } from '@/lib/auth-client';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react';
import type { AppUser } from '@/types/auth'
import Spinner from 'react-bootstrap/Spinner';

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

  if (isPending) return <Spinner animation="border" variant="primary" 
  className="flex flex-col items-center"
  />

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
      <div className="flex justify-end pt-4 pr-4 gap-4 items-center font-medium">
        <div>Welcome {session?.user.name}!</div>
        <button onClick={handleSignOut} className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition cursor-pointer">
          Sign Out
        </button>
      </div>
      <Outlet />
    </div>
  )
}
