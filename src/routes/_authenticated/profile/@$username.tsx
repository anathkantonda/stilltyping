import { createFileRoute } from '@tanstack/react-router'
import { getProfileAndPosts } from '@/server/profile'
import { useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile/@$username')({
  loader: async ({ params }) => {
    const result = await getProfileAndPosts({
      data: {username: params.username},
    })

    if(!result){
      throw new Response('Not Found', {status: 404})
    }

    return result
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { profile, posts } = useLoaderData({ from: Route.id })

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <div className="text-xl font-bold">@{profile.username}</div>
        {profile.name && (
          <div className="text-gray-600">{profile.name}</div>
        )}
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-gray-500">No posts yet.</p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg bg-white">
            <p>{post.content}</p>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}