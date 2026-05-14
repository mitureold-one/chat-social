'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PostCard } from '@/components/feed/PostCard'
import { Avatar, AvatarFallback,  AvatarImage  } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Post = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { username: string; full_name: string } | null
  likes: { user_id: string }[]
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()
  const MAX_CHARS = 280

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      loadPosts()
    }
    init()
  }, [])

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, full_name, avatar_url), likes(user_id)')
      .order('created_at', { ascending: false })
      .limit(50)
    setPosts((data as Post[]) ?? [])
  }

  // Realtime — novos posts aparecem automaticamente
  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' },
        () => loadPosts()
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handlePost() {
    if (!content.trim() || !profile || content.length > MAX_CHARS) return
    setPosting(true)
    await supabase.from('posts').insert({
      content: content.trim(),
      user_id: profile.id,
    })
    setContent('')
    setCharCount(0)
    setPosting(false)
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    setCharCount(e.target.value.length)
  }

  const initial = (profile?.full_name || profile?.username || '?')[0]?.toUpperCase()
  const remaining = MAX_CHARS - charCount
  const isOverLimit = remaining < 0

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">

        {/* Área de criar post */}
        <div className="border border-neutral-200 rounded-2xl p-4 mb-6 bg-white">
          <div className="flex gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={profile?.avatar_url ?? undefined} className="object-cover" />
              <AvatarFallback className="bg-neutral-100 text-neutral-700 text-sm font-medium">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <textarea
                placeholder="No que você está pensando?"
                value={content}
                onChange={handleContentChange}
                rows={3}
                className="w-full text-sm resize-none outline-none placeholder:text-neutral-400 bg-transparent"
              />
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-neutral-400'}`}>
                  {remaining} caracteres
                </span>
                <Button
                  size="sm"
                  onClick={handlePost}
                  disabled={posting || !content.trim() || isOverLimit}
                  className="rounded-full px-5"
                >
                  {posting ? 'Publicando...' : 'Publicar'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={profile?.id ?? ''}
              onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))}
            />
          ))}
          {posts.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-12">
              Nenhum post ainda. Seja o primeiro!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}