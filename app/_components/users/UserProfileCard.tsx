import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar'
import { Separator } from '@/_components/ui/separator'

type Profile = {
  full_name?: string | null
  username?: string | null
  bio?: string | null
  avatar_url?: string | null
}

type UserProfileCardProps = {
  profile: Profile | null
  postCount: number
  initial: string
}

export function UserProfileCard({ profile, postCount, initial }: UserProfileCardProps) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-white">
      <div className="flex items-start gap-4 mb-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? profile?.username ?? 'Avatar'} />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-bold leading-tight">
            {profile?.full_name || profile?.username}
          </h2>
          <p className="text-sm text-neutral-400">@{profile?.username}</p>
          {profile?.bio ? (
            <p className="text-sm text-neutral-600 leading-relaxed mt-2">{profile.bio}</p>
          ) : (
            <p className="text-sm text-neutral-300 italic mt-2">Sem bio</p>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex gap-8">
        <div>
          <p className="text-xl font-bold">{postCount}</p>
          <p className="text-xs text-neutral-400">Posts</p>
        </div>
      </div>
    </div>
  )
}