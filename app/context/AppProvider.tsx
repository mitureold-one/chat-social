'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

type AppContextValue = {
  supabase: ReturnType<typeof createSupabaseClient> | null
  user: User | null
  profile: Profile | null
  setProfile: (p: Profile | null) => void
  loading: boolean
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

function AppShell() {
  return (
    <div className="flex h-screen bg-white">
      {/* sidebar placeholder */}
      <div className="hidden md:flex w-56 shrink-0 border-r border-neutral-100 bg-white" />
      {/* conteudo placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin" />
          <span className="text-sm text-neutral-400">Carregando...</span>
        </div>
      </div>
    </div>
  )
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseClient())
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let active = true

    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      setUser(data.user ?? null)
      if (data.user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        if (!active) return
        setProfile(prof ?? null)
      }
      setLoading(false)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        setProfile(prof ?? null)
      } else {
        setProfile(null)
      }
    })

    return () => {
      active = false
      listener?.subscription.unsubscribe()
    }
  }, [supabase])

  // Antes de hidratar no cliente, mostra um shell neutro
  // Evita hydration mismatch e flash de conteúdo errado
  if (!mounted) {
    return (
      <AppContext.Provider value={{ supabase, user: null, profile: null, setProfile: () => {}, loading: true }}>
        <AppShell />
      </AppContext.Provider>
    )
  }

  return (
    <AppContext.Provider value={{ supabase, user, profile, setProfile, loading }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
