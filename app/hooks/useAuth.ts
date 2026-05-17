'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppProvider'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { supabase } = useApp()

  async function signIn(email: string, password: string, redirect = '/feed') {
    setLoading(true)
    setError('')
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-mail ou senha inválidos.')
      setLoading(false)
      return false
    }
    router.push(redirect)
    setLoading(false)
    return true
  }

  async function signUp(fullName: string, email: string, password: string) {
    setLoading(true)
    setError('')
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return false
    }
    // Se a sessão já existe, o Supabase confirmou automaticamente (e-mail confirm desabilitado)
    // Se não, o usuário precisa confirmar o e-mail antes de logar
    if (data.session) {
      router.push('/feed')
    } else {
      setError('Verifique seu e-mail para confirmar o cadastro antes de entrar.')
    }
    setLoading(false)
    return true
  }

  return { loading, error, setError, signIn, signUp }
}
