'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchDirectMessages, sendDirectMessage } from '@/lib/services/messages.service'
import { fetchProfile } from '@/lib/services/profiles.service'
import type { DirectMessage, Profile } from '@/lib/types'

export function useDirectMessagePage() {
  const { userId } = useParams<{ userId: string }>()
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [myProfile, setMyProfile] = useState<Profile | null>(null)
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { supabase, profile: ctxProfile } = useApp()

  useEffect(() => {
    async function init() {
      const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
      if (!user) { router.push('/auth/login'); return }

      const [me, other] = await Promise.all([
        Promise.resolve(ctxProfile ?? fetchProfile(supabase!, user.id)),
        fetchProfile(supabase!, userId),
      ])

      setMyProfile(me)
      setOtherProfile(other)
      setMessages(await fetchDirectMessages(supabase!, user.id, userId))
    }
    init()
  }, [userId])

  useEffect(() => {
    if (!myProfile) return
    const channel = supabase!
      .channel(`dm:${[myProfile.id, userId].sort().join('-')}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => {
        const msg = payload.new as DirectMessage
        if (
          (msg.sender_id === myProfile.id && msg.receiver_id === userId) ||
          (msg.sender_id === userId && msg.receiver_id === myProfile.id)
        ) {
          setMessages(prev => [...prev, msg])
        }
      })
      .subscribe()
    return () => { supabase!.removeChannel(channel) }
  }, [myProfile, userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!newMessage.trim() || !myProfile) return
    setSending(true)
    await sendDirectMessage(supabase!, myProfile.id, userId, newMessage.trim())
    setNewMessage('')
    setSending(false)
  }

  return {
    messages,
    myProfile,
    otherProfile,
    newMessage,
    sending,
    bottomRef,
    setNewMessage,
    sendMessage,
    back: () => router.back(),
  }
}
