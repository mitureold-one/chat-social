import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchUsers } from '@/lib/services/messages.service'
import type { Profile } from '@/lib/types'

export function useMessagesPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { supabase } = useApp()

  useEffect(() => {
    async function load() {
      const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
      if (!user) { router.push('/auth/login'); return }
      const data = await fetchUsers(supabase!, user.id)
      setUsers(data)
    }
    load()
  }, [])

  return {
    users,
    search,
    setSearch,
    openChat: (userId: string) => router.push(`/messages/${userId}`),
  }
}
