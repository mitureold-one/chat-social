import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { fetchGroups } from '@/lib/services/groups.service'
import type { GroupWithMeta } from '@/lib/services/groups.service'

export function useGroupsPage() {
  const [groups, setGroups] = useState<GroupWithMeta[]>([])
  const router = useRouter()
  const { supabase } = useApp()

  useEffect(() => {
    async function load() {
      const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
      if (!user) { router.push('/auth/login'); return }
      const data = await fetchGroups(supabase!, user.id)
      setGroups(data)
    }
    load()
  }, [])

  return {
    groups,
    onCreate: () => router.push('/groups/new'),
    onOpenGroup: (groupId: string) => router.push(`/groups/${groupId}`),
    setGroups,
  }
}
