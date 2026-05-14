export type Profile = {
  id: string
  username?: string | null
  full_name?: string | null
  avatar_url?: string | null
  bio?: string | null
}

export type Post = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles?: { username: string; full_name: string; avatar_url?: string } | null
  likes?: { user_id: string }[]
}

export type Group = {
  id: string
  name: string
  description?: string
  is_private: boolean
  password_hash?: string | null
  created_by: string
}

export type GroupMessage = {
  id: string
  group_id: string
  user_id: string
  content: string
  created_at: string
}

export type DirectMessage = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}
