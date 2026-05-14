'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Globe, Plus, LogIn } from 'lucide-react'

type Group = {
  id: string
  name: string
  description: string
  is_private: boolean
  created_by: string
  profiles: { username: string }
  isMember: boolean
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data: allGroups } = await supabase
        .from('groups')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })

      const { data: myMemberships } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)

      const memberSet = new Set(myMemberships?.map(m => m.group_id))
      setGroups((allGroups ?? []).map(g => ({ ...g, isMember: memberSet.has(g.id) })))
    }
    load()
  }, [])

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Grupos</h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-0.5">Participe de conversas em grupo</p>
          </div>
          <Button size="sm" onClick={() => router.push('/groups/new')}>
            <Plus size={15} className="mr-1.5" /> Criar
          </Button>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {groups.map(group => (
            <div
              key={group.id}
              className="border border-neutral-200 rounded-xl p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {group.is_private
                    ? <Lock size={15} className="text-neutral-400" />
                    : <Globe size={15} className="text-neutral-400" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{group.name}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {group.is_private ? 'Privado' : 'Público'}
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{group.description}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">@{group.profiles?.username}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant={group.isMember ? 'default' : 'outline'}
                className="shrink-0 ml-3"
                onClick={() => router.push(`/groups/${group.id}`)}
              >
                <LogIn size={13} className="mr-1" />
                {group.isMember ? 'Abrir' : 'Entrar'}
              </Button>
            </div>
          ))}

          {groups.length === 0 && (
            <div className="text-center py-16 text-neutral-400 text-sm">
              Nenhum grupo criado ainda. Seja o primeiro!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}