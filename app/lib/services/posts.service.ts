import type { SupabaseClient } from '@supabase/supabase-js'
import type { Post } from '@/lib/types'

export async function fetchPosts(supabase: SupabaseClient): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, full_name, avatar_url), likes(user_id)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data ?? []
}

export async function fetchUserPosts(supabase: SupabaseClient, userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, full_name, avatar_url), likes(user_id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createPost(supabase: SupabaseClient, userId: string, content: string): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({ content, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(supabase: SupabaseClient, postId: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw error
}

export async function addLike(supabase: SupabaseClient, postId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: userId })
  if (error) throw error
}

export async function removeLike(supabase: SupabaseClient, postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId)
  if (error) throw error
}
