import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import {
  fetchGroup,
  checkMembership,
  fetchGroupMessages,
  joinGroup,
  leaveGroup,
  deleteGroup,
  sendGroupMessage,
} from '@/lib/services/groups.service'
import type { Group } from '@/lib/types'
import type { GroupMessageWithProfile } from '@/lib/services/groups.service'

export function useGroupChatPage() {
  const { id } = useParams<{ id: string }>()
  const [group, setGroup] = useState<Group | null>(null)
  const [messages, setMessages] = useState<GroupMessageWithProfile[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isMember, setIsMember] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { supabase, profile } = useApp()

  useEffect(() => {
    async function init() {
      const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
      if (!user) { router.push('/auth/login'); return }

      const groupData = await fetchGroup(supabase!, id)
      setGroup(groupData)

      const member = await checkMembership(supabase!, id, user.id)
      if (member) {
        setIsMember(true)
        setMessages(await fetchGroupMessages(supabase!, id))
      }
    }
    init()
  }, [id])

  useEffect(() => {
    if (!isMember) return
    const channel = supabase!
      .channel(`group:${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'group_messages',
        filter: `group_id=eq.${id}`,
      }, async (payload) => {
        const { data: sender } = await supabase!
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', payload.new.user_id)
          .single()
        setMessages(prev => [...prev, { ...(payload.new as GroupMessageWithProfile), profiles: sender }])
      })
      .subscribe()
    return () => { supabase!.removeChannel(channel) }
  }, [isMember, id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleJoin() {
    if (!profile || !group) return
    if (group.is_private && password !== group.password_hash) {
      setPwError('Senha incorreta'); return
    }
    await joinGroup(supabase!, id, profile.id)
    setIsMember(true)
    setMessages(await fetchGroupMessages(supabase!, id))
  }

  async function handleLeave() {
    if (!profile) return
    if (!confirm('Tem certeza que deseja sair do grupo?')) return
    await leaveGroup(supabase!, id, profile.id)
    router.push('/groups')
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja EXCLUIR o grupo? Isso é irreversível.')) return
    await deleteGroup(supabase!, id)
    router.push('/groups')
  }

  async function sendMessage() {
    if (!newMessage.trim() || !profile) return
    setLoading(true)
    await sendGroupMessage(supabase!, id, profile.id, newMessage.trim())
    setNewMessage('')
    setLoading(false)
  }

  return {
    group,
    messages,
    newMessage,
    profile,
    isMember,
    password,
    pwError,
    loading,
    bottomRef,
    setPassword,
    setPwError,
    setNewMessage,
    handleJoin,
    handleLeave,
    handleDelete,
    sendMessage,
    back: () => router.push('/groups'),
  }
}
