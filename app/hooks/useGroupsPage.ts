import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchGroups } from '@/lib/services/groups.service'
import type { GroupWithMeta } from '@/lib/services/groups.service'

export function useGroupsPage() {
  const [groups, setGroups] = useState<GroupWithMeta[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()
  const { supabase, user, loading } = useApp()

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/auth/login'); return }
    fetchGroups(supabase!, user.id)
      .then(setGroups)
      .finally(() => setPageLoading(false))
  }, [loading, user])

  return {
    groups,
    pageLoading: loading || pageLoading,
    onCreate: () => router.push('/groups/new'),
    onOpenGroup: (groupId: string) => router.push(`/groups/${groupId}`),
    setGroups,
  }
}
