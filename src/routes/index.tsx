import { createFileRoute, Link } from '@tanstack/react-router'
import Header from '@/components/Header'

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className="flex flex-col gap-12 text-white">
      <Header />

      <div className="flex justify-center gap-4">
        <Link to="/register" className="border bg-black text-white p-2 w-30 font-medium text-center hover:bg-sky-700">Register</Link>
        <Link to="/login" className="border bg-black text-white p-2 w-30 font-medium text-center hover:bg-sky-700">Login</Link>
      </div>
    </div>
  )
}
