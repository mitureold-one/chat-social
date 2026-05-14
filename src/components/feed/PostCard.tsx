'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'


type Post = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { username: string; full_name: string; avatar_url?: string } | null
  likes: { user_id: string }[]
}

type Props = {
  post: Post
  currentUserId: string
  onDelete?: (id: string) => void
}

export function PostCard({ post, currentUserId, onDelete }: Props) {
  const supabase = createClient()
  const isLiked = post.likes.some(l => l.user_id === currentUserId)
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const isOwner = post.user_id === currentUserId

  const authorName = post.profiles?.full_name || post.profiles?.username || 'Usuário'
  const authorUsername = post.profiles?.username || ''
  const initial = authorName[0].toUpperCase()

  const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  async function toggleLike() {
    if (liked) {
      await supabase.from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', currentUserId)
      setLikeCount(c => c - 1)
    } else {
      await supabase.from('likes')
        .insert({ post_id: post.id, user_id: currentUserId })
      setLikeCount(c => c + 1)
    }
    setLiked(!liked)
  }

  async function handleDelete() {
    if (!confirm('Deletar este post?')) return
    await supabase.from('posts').delete().eq('id', post.id)
    onDelete?.(post.id)
  }

  return (
    <article className="border border-neutral-200 rounded-2xl p-4 bg-white hover:bg-neutral-50 transition-colors">
      {/* Autor */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.profiles?.avatar_url ?? undefined} className="object-cover" />
            <AvatarFallback className="bg-neutral-100 text-neutral-700 text-sm font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-tight">{authorName}</p>
            <p className="text-xs text-neutral-400">@{authorUsername} · {formattedDate}</p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-neutral-300 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <p className="text-sm text-neutral-800 leading-relaxed mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Ações */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
            liked
              ? 'bg-red-50 text-red-500'
              : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600'
          }`}
        >
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
      </div>
    </article>
  )
}