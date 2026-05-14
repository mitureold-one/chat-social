'use client'

import { AvatarUpload } from '@/_components/profile/AvatarUpload'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { Separator } from '@/_components/ui/separator'

type Profile = {
  id: string
  username?: string | null
  full_name?: string | null
  bio?: string | null
  avatar_url?: string | null
}

type ProfileCardProps = {
  profile: Profile | null
  editing: boolean
  fullName: string
  bio: string
  saving: boolean
  initial: string
  postCount: number
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onLogout: () => void
  onFullNameChange: (value: string) => void
  onBioChange: (value: string) => void
  onAvatarUpload: (url: string) => void
}

export function ProfileCard({
  profile,
  editing,
  fullName,
  bio,
  saving,
  initial,
  postCount,
  onEdit,
  onCancel,
  onSave,
  onLogout,
  onFullNameChange,
  onBioChange,
  onAvatarUpload,
}: ProfileCardProps) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-white">
      <div className="flex items-start justify-between mb-5">
        <AvatarUpload
          userId={profile?.id ?? ''}
          avatarUrl={profile?.avatar_url ?? null}
          initial={initial ?? '?'}
          editable
          onUpload={onAvatarUpload}
        />
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Editar perfil
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancelar
              </Button>
              <Button size="sm" onClick={onSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Nome</label>
            <Input value={fullName} onChange={e => onFullNameChange(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Bio</label>
            <textarea
              value={bio}
              onChange={e => onBioChange(e.target.value)}
              placeholder="Fale um pouco sobre você..."
              rows={3}
              maxLength={160}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-neutral-300 placeholder:text-neutral-400"
            />
            <p className="text-xs text-neutral-400 text-right">{bio.length}/160</p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold leading-tight">
            {profile?.full_name || profile?.username}
          </h2>
          <p className="text-sm text-neutral-400 mb-3">@{profile?.username}</p>
          {profile?.bio ? (
            <p className="text-sm text-neutral-600 leading-relaxed">{profile.bio}</p>
          ) : (
            <p className="text-sm text-neutral-300 italic">Sem bio ainda. Clique em editar para adicionar!</p>
          )}
        </div>
      )}

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