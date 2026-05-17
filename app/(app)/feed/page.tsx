'use client'

import { useFeedPage } from '@/hooks/useFeedPage'
import { FeedComposer } from '@/_components/feed/FeedComposer'
import { FeedList } from '@/_components/feed/FeedList'
import { FeedSkeleton } from '@/_components/ui/skeletons'

export default function FeedPage() {
  const feed = useFeedPage()

  if (feed.pageLoading) return <FeedSkeleton />

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">
        <FeedComposer
          avatarUrl={feed.profile?.avatar_url ?? undefined}
          initial={feed.initial}
          content={feed.content}
          posting={feed.posting}
          remaining={feed.remaining}
          isOverLimit={feed.isOverLimit}
          onContentChange={feed.handleContentChange}
          onPost={feed.handlePost}
        />
        <FeedList
          posts={feed.posts}
          currentUserId={feed.profile?.id ?? ''}
          onDelete={id => feed.setPosts(prev => prev.filter(p => p.id !== id))}
        />
      </div>
    </div>
  )
}
