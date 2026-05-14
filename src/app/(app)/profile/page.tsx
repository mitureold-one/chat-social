'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PostCard } from '@/components/feed/PostCard'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [postCount, setPostCount] = useState(0)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      setFullName(prof?.full_name || '')
      setBio(prof?.bio || '')

      const { data: userPosts } = await supabase
        .from('posts')
        .select('*, profiles(username, full_name, avatar_url), likes(user_id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPosts(userPosts ?? [])
      setPostCount(userPosts?.length ?? 0)
    }
    init()
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio })
      .eq('id', profile.id)
      .select()
      .single()
    setProfile(data)
    setEditing(false)
    setSaving(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initial = (profile?.full_name || profile?.username || '?')[0]?.toUpperCase()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">

        {/* Card de perfil */}
        <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-white">

          {/* Topo: avatar + botões */}
          <div className="flex items-start justify-between mb-5">
            <AvatarUpload
              userId={profile?.id ?? ''}
              avatarUrl={profile?.avatar_url}
              initial={initial ?? '?'}
              editable={!editing ? true : true}
              onUpload={(url) => setProfile((prev: any) => ({ ...prev, avatar_url: url }))}
            />
            <div className="flex gap-2">
              {!editing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    Editar perfil
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => { setEditing(false); setFullName(profile?.full_name || ''); setBio(profile?.bio || '') }}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Informações */}
          {editing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500">Nome</label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Fale um pouco sobre você..."
                  rows={3}
                  maxLength={160}
                  className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-neutral-300 placeholder:text-neutral-400"
                />
                <p className="text-xs text-neutral-400 text-right">{bio.length}/160</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {profile?.full_name || profile?.username}
              </h2>
              <p className="text-sm text-neutral-400 mb-3">@{profile?.username}</p>
              {profile?.bio ? (
                <p className="text-sm text-neutral-600 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-sm text-neutral-300 italic">Sem bio ainda. Clique em editar para adicionar!</p>
              )}
            </div>
          )}

          <Separator className="my-4" />

          {/* Estatísticas */}
          <div className="flex gap-8">
            <div>
              <p className="text-xl font-bold">{postCount}</p>
              <p className="text-xs text-neutral-400">Posts</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
          Seus posts
        </p>
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={profile?.id ?? ''}
              onDelete={id => {
                setPosts(prev => prev.filter(p => p.id !== id))
                setPostCount(c => c - 1)
              }}
            />
          ))}
          {posts.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-8">
              Você ainda não fez nenhum post.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}