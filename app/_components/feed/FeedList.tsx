import { PostCard } from '@/_components/feed/PostCard'
import type { Post } from '@/lib/types'

type FeedListProps = {
  posts: Post[]
  currentUserId: string
  onDelete: (id: string) => void
}

export function FeedList({ posts, currentUserId, onDelete }: FeedListProps) {
  return (
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
        <p className="text-center text-sm text-neutral-400 py-12">
          Nenhum post ainda. Seja o primeiro!
        </p>
      )}
    </div>
  )
}
