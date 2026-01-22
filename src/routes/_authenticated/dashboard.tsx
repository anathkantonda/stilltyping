import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div>
      <h2 className="text-xl font-medium">Posts</h2>
    </div>
  )
}