import type { SupabaseClient } from '@supabase/supabase-js'
import type { Group, GroupMessage } from '@/lib/types'

export type GroupWithMeta = Group & {
  profiles: { username: string }
  isMember: boolean
}

export type GroupMessageWithProfile = GroupMessage & {
  profiles: { username: string; full_name: string; avatar_url?: string } | null
}

export async function fetchGroups(supabase: SupabaseClient, userId: string): Promise<GroupWithMeta[]> {
  const [{ data: allGroups }, { data: memberships }] = await Promise.all([
    supabase.from('groups').select('*, profiles(username)').order('created_at', { ascending: false }),
    supabase.from('group_members').select('group_id').eq('user_id', userId),
  ])
  const memberSet = new Set(memberships?.map(m => m.group_id) ?? [])
  return (allGroups ?? []).map(g => ({ ...g, isMember: memberSet.has(g.id) }))
}

export async function fetchGroup(supabase: SupabaseClient, groupId: string): Promise<Group | null> {
  const { data } = await supabase.from('groups').select('*').eq('id', groupId).single()
  return data ?? null
}

export async function createGroup(
  supabase: SupabaseClient,
  payload: Pick<Group, 'name' | 'description' | 'is_private' | 'created_by'> & { password_hash: string | null }
): Promise<Group> {
  const { data, error } = await supabase.from('groups').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function deleteGroup(supabase: SupabaseClient, groupId: string): Promise<void> {
  const { error } = await supabase.from('groups').delete().eq('id', groupId)
  if (error) throw error
}

export async function checkMembership(supabase: SupabaseClient, groupId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single()
  return !!data
}

export async function joinGroup(supabase: SupabaseClient, groupId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: userId })
  if (error) throw error
}

export async function leaveGroup(supabase: SupabaseClient, groupId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function fetchGroupMessages(
  supabase: SupabaseClient,
  groupId: string
): Promise<GroupMessageWithProfile[]> {
  const { data, error } = await supabase
    .from('group_messages')
    .select('*, profiles(username, full_name, avatar_url)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })
    .limit(100)
  if (error) throw error
  return data ?? []
}

export async function sendGroupMessage(
  supabase: SupabaseClient,
  groupId: string,
  userId: string,
  content: string
): Promise<GroupMessage> {
  const { data, error } = await supabase
    .from('group_messages')
    .insert({ group_id: groupId, user_id: userId, content })
    .select()
    .single()
  if (error) throw error
  return data
}
