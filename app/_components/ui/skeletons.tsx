function Bone({ className }: { className?: string }) {
  return (
    <div className={`bg-neutral-100 rounded-lg animate-pulse ${className ?? ''}`} />
  )
}

export function PostCardSkeleton() {
  return (
    <div className="border border-neutral-200 rounded-2xl p-4 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <Bone className="h-9 w-9 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Bone className="h-3 w-28" />
          <Bone className="h-2.5 w-20" />
        </div>
      </div>
      <Bone className="h-3 w-full mb-1.5" />
      <Bone className="h-3 w-4/5 mb-1.5" />
      <Bone className="h-3 w-2/3 mb-4" />
      <Bone className="h-6 w-14 rounded-full" />
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">
        {/* composer placeholder */}
        <div className="border border-neutral-200 rounded-2xl p-4 mb-6 bg-white">
          <div className="flex gap-3">
            <Bone className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-48" />
              <Bone className="h-3 w-32" />
              <Bone className="h-3 w-full" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function GroupListSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5">
            <Bone className="h-6 w-24" />
            <Bone className="h-3 w-40" />
          </div>
          <Bone className="h-8 w-20 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex gap-3 items-start min-w-0">
                <Bone className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <Bone className="h-3 w-36" />
                  <Bone className="h-2.5 w-24" />
                  <Bone className="h-2.5 w-20" />
                </div>
              </div>
              <Bone className="h-8 w-20 rounded-lg shrink-0 ml-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MessageListSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <div className="mb-6 space-y-1.5">
          <Bone className="h-6 w-36" />
          <Bone className="h-3 w-48" />
        </div>
        <Bone className="h-9 w-full rounded-lg mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200">
              <Bone className="h-9 w-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Bone className="h-3 w-32" />
                <Bone className="h-2.5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  const messages = [
    { own: false, w: 'w-48' },
    { own: true,  w: 'w-36' },
    { own: false, w: 'w-64' },
    { own: false, w: 'w-40' },
    { own: true,  w: 'w-52' },
    { own: true,  w: 'w-28' },
  ]
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
        <Bone className="h-4 w-4" />
        <Bone className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Bone className="h-3 w-32" />
          <Bone className="h-2.5 w-20" />
        </div>
      </div>
      <div className="flex-1 px-6 py-4 space-y-4 overflow-hidden">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.own ? 'flex-row-reverse' : ''}`}>
              {!m.own && <Bone className="h-8 w-8 rounded-full shrink-0" />}
              <Bone className={`h-9 ${m.w} rounded-2xl`} />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-neutral-200 px-6 py-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Bone className="h-9 flex-1 rounded-lg" />
          <Bone className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">
        <div className="border border-neutral-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-5">
            <Bone className="h-16 w-16 rounded-full" />
            <div className="flex gap-2">
              <Bone className="h-8 w-24 rounded-lg" />
              <Bone className="h-8 w-16 rounded-lg" />
            </div>
          </div>
          <Bone className="h-4 w-40 mb-1.5" />
          <Bone className="h-3 w-24 mb-4" />
          <Bone className="h-3 w-full mb-1.5" />
          <Bone className="h-3 w-3/4 mb-4" />
          <div className="border-t border-neutral-100 pt-4">
            <Bone className="h-6 w-10" />
            <Bone className="h-2.5 w-8 mt-1" />
          </div>
        </div>
        <Bone className="h-3 w-20 mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
