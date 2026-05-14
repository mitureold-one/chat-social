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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseClient())
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data.user ?? null)
      if (data.user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
        if (!mounted) return
        setProfile(prof ?? null)
      }
      setLoading(false)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
        setProfile(prof ?? null)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      if (listener) listener.subscription.unsubscribe()
    }
  }, [supabase])

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
