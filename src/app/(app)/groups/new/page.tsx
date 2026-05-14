'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function NewGroupPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleCreate() {
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    if (isPrivate && !password.trim()) { setError('Senha é obrigatória para grupos privados'); return }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: group, error: err } = await supabase
      .from('groups')
      .insert({
        name: name.trim(),
        description: description.trim(),
        is_private: isPrivate,
        password_hash: isPrivate ? password : null, // em prod usaria hash real
        created_by: user.id,
      })
      .select()
      .single()

    if (err || !group) { setError('Erro ao criar grupo'); setLoading(false); return }

    // Criador entra automaticamente como membro
    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id })

    router.push(`/groups/${group.id}`)
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">Criar novo grupo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nome do grupo *</label>
            <Input placeholder="Ex: Turma de ES" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descrição</label>
            <Input placeholder="Sobre o que é esse grupo?" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <label htmlFor="private" className="text-sm font-medium cursor-pointer">
              Grupo privado (exige senha para entrar)
            </label>
          </div>
          {isPrivate && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senha do grupo *</label>
              <Input
                type="password"
                placeholder="Senha que os membros usarão para entrar"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} className="flex-1">Cancelar</Button>
          <Button onClick={handleCreate} disabled={loading} className="flex-1">
            {loading ? 'Criando...' : 'Criar grupo'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}