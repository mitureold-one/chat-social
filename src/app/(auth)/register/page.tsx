'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/chat')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-sm border border-neutral-200 shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💬</span>
            <h1 className="text-xl font-bold tracking-tight">Chat Social</h1>
          </div>
          <CardTitle className="text-lg font-semibold">Criar conta</CardTitle>
          <CardDescription>Preencha os dados para se cadastrar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <Input placeholder="Seu nome completo" value={fullName} onChange={e => setFullName(e.target.value)} />
          <Input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={handleRegister} disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
          <p className="text-sm text-neutral-500">
            Já tem conta?{' '}
            <Link href="/login" className="text-black font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}