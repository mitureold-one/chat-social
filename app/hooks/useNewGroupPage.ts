import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'
import { createGroup, joinGroup } from '@/lib/services/groups.service'

export function useNewGroupPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { supabase } = useApp()

  async function handleCreate() {
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    if (isPrivate && !password.trim()) { setError('Senha é obrigatória para grupos privados'); return }

    setLoading(true)
    const user = (supabase && (await supabase.auth.getUser()).data.user) ?? null
    if (!user) { router.push('/auth/login'); return }

    const group = await createGroup(supabase!, {
      name: name.trim(),
      description: description.trim(),
      is_private: isPrivate,
      password_hash: isPrivate ? password : null,
      created_by: user.id,
    }).catch(() => null)

    if (!group) { setError('Erro ao criar grupo'); setLoading(false); return }

    await joinGroup(supabase!, group.id, user.id)
    router.push(`/groups/${group.id}`)
  }

  return {
    name,
    description,
    isPrivate,
    password,
    loading,
    error,
    setName,
    setDescription,
    setIsPrivate,
    setPassword,
    handleCreate,
    back: () => router.back(),
  }
}
