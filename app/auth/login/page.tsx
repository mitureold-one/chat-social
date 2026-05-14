'use client'

import { useState } from 'react'
import { Input } from '@/_components/ui/input'
import { AuthCard } from '@/_components/auth/AuthCard'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth()

  async function handleLogin() {
    await auth.signIn(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <AuthCard
        title="Entrar na sua conta"
        description="Acesse sua conta para continuar"
        error={auth.error}
        submitLabel="Entrar"
        loadingLabel="Entrando..."
        loading={auth.loading}
        footerLinkHref="/auth/register"
        footerLinkLabel="Cadastre-se"
        footerPrefix="Não tem conta?"
        onSubmit={handleLogin}
      >
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
      </AuthCard>
    </div>
  )
}