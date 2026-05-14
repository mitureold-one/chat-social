'use client'

import type { ChangeEvent } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar'
import { Button } from '@/_components/ui/button'

type FeedComposerProps = {
  avatarUrl?: string
  initial: string
  content: string
  posting: boolean
  remaining: number
  isOverLimit: boolean
  onContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onPost: () => void
}

export function FeedComposer({
  avatarUrl,
  initial,
  content,
  posting,
  remaining,
  isOverLimit,
  onContentChange,
  onPost,
}: FeedComposerProps) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-4 mb-6 bg-white">
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={avatarUrl} className="object-cover" />
          <AvatarFallback className="bg-neutral-100 text-neutral-700 text-sm font-medium">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <textarea
            placeholder="No que você está pensando?"
            value={content}
            onChange={onContentChange}
            rows={3}
            className="w-full text-sm resize-none outline-none placeholder:text-neutral-400 bg-transparent"
          />
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-neutral-400'}`}>
              {remaining} caracteres
            </span>
            <Button
              size="sm"
              onClick={onPost}
              disabled={posting || !content.trim() || isOverLimit}
              className="rounded-full px-5"
            >
              {posting ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}