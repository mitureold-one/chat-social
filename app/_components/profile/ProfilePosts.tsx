import { PostCard } from '@/_components/feed/PostCard'
import type { Post } from '@/lib/types'

type ProfilePostsProps = {
  posts: Post[]
  currentUserId: string
  onDelete: (id: string) => void
}

export function ProfilePosts({ posts, currentUserId, onDelete }: ProfilePostsProps) {
  return (
    <>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Seus posts
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
            Você ainda não fez nenhum post.
          </p>
        )}
      </div>
    </>
  )
}
