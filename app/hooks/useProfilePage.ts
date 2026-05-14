'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchUserPosts } from '@/lib/services/posts.service'
import { fetchProfile, updateProfile } from '@/lib/services/profiles.service'
import type { Profile, Post } from '@/lib/types'

export function useProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { supabase, profile: ctxProfile, setProfile: setCtxProfile } = useApp()

  useEffect(() => {
    async function init() {
      const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
      if (!user) { router.push('/auth/login'); return }

      const prof = ctxProfile ?? await fetchProfile(supabase!, user.id)
      setProfile(prof)
      setFullName(prof?.full_name || '')
      setBio(prof?.bio || '')

      setPosts(await fetchUserPosts(supabase!, user.id))
    }
    init()
  }, [])

  async function save() {
    if (!profile) return
    setSaving(true)
    const updated = await updateProfile(supabase!, profile.id, { full_name: fullName, bio })
    setProfile(updated)
    setCtxProfile(updated)
    setEditing(false)
    setSaving(false)
  }

  async function logout() {
    await supabase!.auth.signOut()
    router.push('/auth/login')
  }

  async function updateAvatar(url: string) {
    if (!profile) return
    const updated = await updateProfile(supabase!, profile.id, { avatar_url: url })
    setProfile(updated)
    setCtxProfile(updated)
  }

  return {
    profile,
    posts,
    editing,
    fullName,
    bio,
    saving,
    initial: (profile?.full_name || profile?.username || '?')[0]?.toUpperCase(),
    startEditing: () => setEditing(true),
    cancelEditing: () => { setEditing(false); setFullName(profile?.full_name || ''); setBio(profile?.bio || '') },
    save,
    logout,
    updateAvatar,
    onFullNameChange: setFullName,
    onBioChange: setBio,
    removePost: (id: string) => setPosts(prev => prev.filter(p => p.id !== id)),
  }
}
