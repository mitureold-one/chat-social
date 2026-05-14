import { PostCard } from '@/_components/feed/PostCard'
import type { Post } from '@/lib/types'

type UserPostsProps = {
  posts: Post[]
  currentUserId: string
  onDelete: (id: string) => void
}

export function UserPosts({ posts, currentUserId, onDelete }: UserPostsProps) {
  return (
    <>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Posts
      </p>
      <div className="space-y-3">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onDelete={onDelete}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-sm text-neutral-400 py-8">
            Este usuário ainda não fez nenhum post.
          </p>
        )}
      </div>
    </>
  )
}
