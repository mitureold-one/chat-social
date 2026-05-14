'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar'

type Profile = {
  full_name?: string | null
  username?: string | null
  avatar_url?: string | null
}

type ChatHeaderProps = {
  otherProfile: Profile | null
  onBack: () => void
}

export function ChatHeader({ otherProfile, onBack }: ChatHeaderProps) {
  return (
    <header className="border-b border-neutral-200 px-6 py-4 flex items-center gap-3">
      <button onClick={onBack} className="text-neutral-400 hover:text-black text-sm">←</button>
      <Avatar className="h-8 w-8">
        <AvatarImage src={otherProfile?.avatar_url ?? undefined} className="object-cover" />
        <AvatarFallback className="text-xs bg-neutral-100">
          {(otherProfile?.full_name || otherProfile?.username || '?')[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-sm">{otherProfile?.full_name || otherProfile?.username}</p>
        <p className="text-xs text-neutral-400">@{otherProfile?.username}</p>
      </div>
    </header>
  )
}