'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function MessagesPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [myId, setMyId] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setMyId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .order('full_name')

      setUsers(data ?? [])
    }
    load()
  }, [])

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Mensagens</h1>
          <p className="text-sm text-neutral-500 mt-1">Escolha alguém para conversar</p>
        </div>

        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Buscar usuário..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filtered.map(user => (
            <button
              key={user.id}
              onClick={() => router.push(`/messages/${user.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-sm bg-neutral-100 text-neutral-700">
                  {(user.full_name || user.username || '?')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.full_name || user.username}</p>
                <p className="text-xs text-neutral-400">@{user.username}</p>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-12">
              Nenhum usuário encontrado.
            </p>
          )}
        </div>
      </div>  
    </div>
  )
}