import type { SupabaseClient } from '@supabase/supabase-js'
import type { DirectMessage, Profile } from '@/lib/types'

export async function fetchDirectMessages(
  supabase: SupabaseClient,
  userA: string,
  userB: string
): Promise<DirectMessage[]> {
  const { data, error } = await supabase
    .from('direct_messages')
    .select('*')
    .or(`and(sender_id.eq.${userA},receiver_id.eq.${userB}),and(sender_id.eq.${userB},receiver_id.eq.${userA})`)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function sendDirectMessage(
  supabase: SupabaseClient,
  senderId: string,
  receiverId: string,
  content: string
): Promise<DirectMessage> {
  const { data, error } = await supabase
    .from('direct_messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, content })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchUsers(supabase: SupabaseClient, excludeId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', excludeId)
    .order('full_name')
  if (error) throw error
  return data ?? []
}
