import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchUsers } from '@/lib/services/messages.service'
import type { Profile } from '@/lib/types'

export function useMessagesPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()
  const { supabase, user, loading } = useApp()

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/auth/login'); return }
    fetchUsers(supabase!, user.id)
      .then(setUsers)
      .finally(() => setPageLoading(false))
  }, [loading, user])

  return {
    users,
    search,
    pageLoading: loading || pageLoading,
    setSearch,
    openChat: (userId: string) => router.push(`/messages/${userId}`),
  }
}
