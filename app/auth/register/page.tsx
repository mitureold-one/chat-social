'use client'

import { useState } from 'react'
import { Input } from '@/_components/ui/input'
import { AuthCard } from '@/_components/auth/AuthCard'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth()

  async function handleRegister() {
    await auth.signUp(fullName, email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <AuthCard
        title="Criar conta"
        description="Preencha os dados para se cadastrar"
        error={auth.error}
        submitLabel="Criar conta"
        loadingLabel="Criando conta..."
        loading={auth.loading}
        footerLinkHref="/auth/login"
        footerLinkLabel="Entrar"
        footerPrefix="Já tem conta?"
        onSubmit={handleRegister}
      >
        <Input placeholder="Seu nome completo" value={fullName} onChange={e => setFullName(e.target.value)} />
        <Input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} />
      </AuthCard>
    </div>
  )
}