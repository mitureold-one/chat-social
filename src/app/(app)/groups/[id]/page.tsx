'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lock, LogOut, Trash2 } from 'lucide-react'

type Message = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { username: string; full_name: string; avatar_url?: string } | null
}

type Group = {
  id: string
  name: string
  is_private: boolean
  password_hash: string | null
  created_by: string
}

export default function GroupChatPage() {
  const { id } = useParams<{ id: string }>()
  const [group, setGroup] = useState<Group | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [isMember, setIsMember] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)

      const { data: groupData } = await supabase
        .from('groups').select('*').eq('id', id).single()
      setGroup(groupData)

      const { data: membership } = await supabase
        .from('group_members')
        .select('id').eq('group_id', id).eq('user_id', user.id).single()

      if (membership) {
        setIsMember(true)
        loadMessages()
      }
    }
    init()
  }, [id])

  async function loadMessages() {
    const { data } = await supabase
      .from('group_messages')
      .select('*, profiles(username, full_name, avatar_url)')
      .eq('group_id', id)
      .order('created_at', { ascending: true })
      .limit(100)
    setMessages(data ?? [])
  }

  // Realtime
  useEffect(() => {
    if (!isMember) return
    const channel = supabase
      .channel(`group:${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'group_messages',
        filter: `group_id=eq.${id}`
      }, async (payload) => {
        const { data: sender } = await supabase
          .from('profiles').select('username, full_name, avatar_url').eq('id', payload.new.user_id).single()
        setMessages(prev => [...prev, { ...(payload.new as Message), profiles: sender }])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [isMember, id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleJoin() {
    if (group?.is_private && password !== group.password_hash) {
      setPwError('Senha incorreta'); return
    }
    await supabase.from('group_members').insert({ group_id: id, user_id: profile.id })
    setIsMember(true)
    loadMessages()
  }

  async function handleLeave() {
    if (!confirm('Tem certeza que deseja sair do grupo?')) return
    await supabase.from('group_members').delete()
      .eq('group_id', id).eq('user_id', profile.id)
    router.push('/groups')
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja EXCLUIR o grupo? Isso é irreversível.')) return
    await supabase.from('groups').delete().eq('id', id)
    router.push('/groups')
  }

  async function sendMessage() {
    if (!newMessage.trim() || !profile) return
    setLoading(true)
    await supabase.from('group_messages').insert({
      group_id: id, user_id: profile.id, content: newMessage.trim()
    })
    setNewMessage('')
    setLoading(false)
  }

  // Tela de entrar no grupo
  if (!isMember && group) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="border border-neutral-200 rounded-2xl p-8 w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center">
            {group.is_private ? <Lock size={32} className="text-neutral-400" /> : null}
          </div>
          <div>
            <h2 className="font-bold text-lg">{group.name}</h2>
            <p className="text-sm text-neutral-500 mt-1">
              {group.is_private ? 'Grupo privado — insira a senha para entrar' : 'Grupo público — clique para entrar'}
            </p>
          </div>
          {group.is_private && (
            <div className="space-y-2 text-left">
              <Input
                type="password"
                placeholder="Senha do grupo"
                value={password}
                onChange={e => { setPassword(e.target.value); setPwError('') }}
              />
              {pwError && <p className="text-xs text-red-500">{pwError}</p>}
            </div>
          )}
          <Button className="w-full" onClick={handleJoin}>Entrar no grupo</Button>
          <Button variant="outline" className="w-full" onClick={() => router.push('/groups')}>Voltar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => router.push('/groups')}
            className="text-neutral-400 hover:text-black text-sm shrink-0"
          >
            ←
          </button>
          <h1 className="font-bold tracking-tight text-sm md:text-base truncate">{group?.name}</h1>
          {group?.is_private && (
            <Badge variant="outline" className="text-xs shrink-0">
              <Lock size={10} className="mr-1" />Privado
            </Badge>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {profile?.id === group?.created_by && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 px-2 md:px-3"
            >
              <Trash2 size={14} />
              <span className="hidden md:inline ml-1.5">Excluir</span>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleLeave} className="px-2 md:px-3">
            <LogOut size={14} />
            <span className="hidden md:inline ml-1.5">Sair</span>
          </Button>
        </div>
      </header>

      {/* Mensagens */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg, i) => {
            const isOwn = msg.user_id === profile?.id
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
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="px-6 py-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            placeholder="Mensagem no grupo..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>Enviar</Button>
        </div>
      </div>
    </div>
  )
}