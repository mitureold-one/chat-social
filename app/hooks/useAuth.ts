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

  async function signUp(fullName: string, email: string, password: string, redirect = '/feed') {
    setLoading(true)
    setError('')
    const { error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return false
    }
    router.push(redirect)
    setLoading(false)
    return true
  }

  return { loading, error, setError, signIn, signUp }
}
