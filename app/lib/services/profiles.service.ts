import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export async function fetchProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data ?? null
}

export async function fetchAllProfiles(supabase: SupabaseClient, excludeId?: string): Promise<Profile[]> {
  let query = supabase.from('profiles').select('*').order('full_name')
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function updateProfile(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Pick<Profile, 'full_name' | 'bio' | 'avatar_url'>>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
