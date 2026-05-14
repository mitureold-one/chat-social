'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DirectMessagePage() {
  const { userId } = useParams<{ userId: string }>()
  const [messages, setMessages] = useState<any[]>([])
  const [myProfile, setMyProfile] = useState<any>(null)
  const [otherProfile, setOtherProfile] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: me }, { data: other }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('*').eq('id', userId).single(),
      ])
      setMyProfile(me)
      setOtherProfile(other)

      const { data: msgs } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      setMessages(msgs ?? [])
    }
    init()
  }, [userId])

  useEffect(() => {
    if (!myProfile) return
    const channel = supabase
      .channel(`dm:${[myProfile.id, userId].sort().join('-')}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => {
        const msg = payload.new as any
        if (
          (msg.sender_id === myProfile.id && msg.receiver_id === userId) ||
          (msg.sender_id === userId && msg.receiver_id === myProfile.id)
        ) {
          setMessages(prev => [...prev, msg])
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [myProfile, userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!newMessage.trim() || !myProfile) return
    await supabase.from('direct_messages').insert({
      sender_id: myProfile.id,
      receiver_id: userId,
      content: newMessage.trim(),
    })
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-neutral-200 px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-neutral-400 hover:text-black text-sm">←</button>
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

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg) => {
            const isOwn = msg.sender_id === myProfile?.id
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-2 text-sm max-w-[70%] ${
                  isOwn ? 'bg-black text-white' : 'bg-neutral-100 text-black'
                }`}>
                  {msg.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <Separator />
      <div className="px-6 py-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            placeholder={`Mensagem para ${otherProfile?.full_name || otherProfile?.username}...`}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>Enviar</Button>
        </div>
      </div>
    </div>
  )
}