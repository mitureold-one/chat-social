'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserProfileCard } from '@/_components/users/UserProfileCard'
import { UserPosts } from '@/_components/users/UserPosts'

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [postCount, setPostCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)

      // Get user profile
      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', userId).single()
      setProfile(prof)

      // Get user posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select('*, profiles(username, full_name, avatar_url), likes(user_id)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      setPosts(userPosts ?? [])
      setPostCount(userPosts?.length ?? 0)
    }
    init()
  }, [userId])

  const initial = (profile?.full_name || profile?.username || '?')[0]?.toUpperCase()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">
        <UserProfileCard profile={profile} postCount={postCount} initial={initial ?? '?'} />

        <UserPosts
          posts={posts}
          currentUserId={currentUserId}
          onDelete={id => {
            setPosts(prev => prev.filter(p => p.id !== id))
            setPostCount(c => c - 1)
          }}
        />
      </div>
    </div>
  )
}
