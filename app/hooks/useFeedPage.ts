'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchPosts, createPost } from '@/lib/services/posts.service'
import type { Post } from '@/lib/types'

const MAX_CHARS = 280

export function useFeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const router = useRouter()
  const { supabase, profile } = useApp()

  async function loadPosts() {
    const data = await fetchPosts(supabase!)
    setPosts(data)
  }

  useEffect(() => {
    async function init() {
      const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
      if (!user) { router.push('/auth/login'); return }
      await loadPosts()
    }
    init()
  }, [])

  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        loadPosts()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handlePost() {
    if (!content.trim() || !profile || content.length > MAX_CHARS) return
    setPosting(true)
    await createPost(supabase!, profile.id, content.trim())
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

  return {
    posts,
    profile,
    content,
    posting,
    remaining,
    isOverLimit,
    initial,
    handleContentChange,
    handlePost,
    setPosts,
  }
}
