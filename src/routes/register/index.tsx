import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Header from '@/components/Header'
import { createFileRoute, Link } from '@tanstack/react-router'
import { signUp } from '@/lib/auth-client';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await signUp.email({
      name,
      email,
      password,
    }, {
      onSuccess: () => {
        navigate({ to: '/dashboard'})
    },
      onError: (ctx) => {
        setError(ctx.error.message || 'An error occurred during registration.');
      }
    });

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-12">
      <Header />

      <div className="flex justify-center gap-4">
        <Link to="/register" className="border bg-gray-400 text-black p-2 w-30 font-medium text-center" disabled>Register</Link>
        <Link to="/login" className="border bg-black text-white p-2 w-30 font-medium text-center hover:bg-sky-700">Login</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-5">
          <input 
            type="text" 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-md border p-2 w-75" />

          <input 
            type="email"  
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-md border p-2 w-75" />

          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-md border p-2 w-75" />

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button type="submit" className="border p-2 btn bg-black text-white hover:bg-sky-700 w-30 text-center cursor-pointer">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  )
}
