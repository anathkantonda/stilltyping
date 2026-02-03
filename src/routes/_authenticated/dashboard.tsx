import { createFileRoute, Link } from '@tanstack/react-router'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { getPostsWithUsers, createPost } from '@/server/posts'

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async () => {
    return {
      posts: await getPostsWithUsers(),
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { posts } = useLoaderData({ from: Route.id })
  const router = useRouter()
  const [post, setPost] = useState('')

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post.trim()) return

    await createPost({
      data: { post },
    })

    setPost('')

    router.invalidate({
      filter: (match) => match.routeId === Route.id,
    })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <form onSubmit={handlePost}>
        <textarea
          rows={4}
          value={post}
          onChange={(e) => setPost(e.target.value)}
          maxLength={140}
          className="border w-full pl-2 pt-2"
          placeholder="Write your post..."
        />

        <button
          type="submit"
          className="border p-2 bg-sky-700 text-white hover:bg-sky-900 rounded-md"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded-xl shadow-lg bg-white"
          >
            <Link
              to="/profile/@$username"
              params={{ username: post.username || '' }}
              className="text-sm font-bold text-blue-600 mb-1 hover:underline inline-block"
            >
              @{post.username}
            </Link>

            <p className="text-gray-800">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}