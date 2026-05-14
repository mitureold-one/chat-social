'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar'
import type { GroupMessageWithProfile } from '@/lib/services/groups.service'

type GroupMessagesProps = {
  messages: GroupMessageWithProfile[]
  currentUserId: string
  bottomRef: React.RefObject<HTMLDivElement | null>
}

export function GroupMessages({ messages, currentUserId, bottomRef }: GroupMessagesProps) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {messages.map((msg, i) => {
        const isOwn = msg.user_id === currentUserId
        const showAvatar = i === 0 || messages[i - 1].user_id !== msg.user_id
        return (
          <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
            {showAvatar ? (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={msg.profiles?.avatar_url ?? undefined} className="object-cover" />
                <AvatarFallback className="text-xs bg-neutral-100 text-neutral-700">
                  {(msg.profiles?.full_name || msg.profiles?.username || '?')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : <div className="w-8 shrink-0" />}
            <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
              {showAvatar && (
                <span className="text-xs text-neutral-400 px-1">
                  {isOwn ? 'Você' : (msg.profiles?.full_name || msg.profiles?.username)}
                </span>
              )}
              <div className={`rounded-2xl px-4 py-2 text-sm ${
                isOwn ? 'bg-black text-white rounded-tr-sm' : 'bg-neutral-100 text-black rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
