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
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { supabase, profile: myProfile, user, loading: authLoading } = useApp()

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/auth/login'); return }

    async function init() {
      const [other, msgs] = await Promise.all([
        fetchProfile(supabase!, userId),
        fetchDirectMessages(supabase!, user!.id, userId),
      ])
      setOtherProfile(other)
      setMessages(msgs)
      setPageLoading(false)
    }
    init()
  }, [authLoading, user, userId])

  useEffect(() => {
    if (!myProfile || !supabase) return
    const channel = supabase
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
    return () => { supabase.removeChannel(channel) }
  }, [myProfile, userId, supabase])

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
    pageLoading: authLoading || pageLoading,
    bottomRef,
    setNewMessage,
    sendMessage,
    back: () => router.back(),
  }
}
