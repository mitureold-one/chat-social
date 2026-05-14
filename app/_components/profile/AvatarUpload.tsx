'use client'

import { useRef, useState } from 'react'
import { useApp } from '@/context/AppProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'

type Props = {
  userId: string
  avatarUrl: string | null
  initial: string
  onUpload: (url: string) => void
  size?: 'sm' | 'lg'
  editable?: boolean
}

export function AvatarUpload({ userId, avatarUrl, initial, onUpload, size = 'lg', editable = true }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { supabase } = useApp()

  const sizeClass = size === 'lg' ? 'h-20 w-20' : 'h-9 w-9'
  const textClass = size === 'lg' ? 'text-2xl' : 'text-sm'

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !supabase) return

    if (file.size > 2 * 1024 * 1024) { alert('Imagem muito grande. Máximo 2MB.'); return }
    if (!file.type.startsWith('image/')) { alert('Selecione uma imagem válida.'); return }

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (error) { alert('Erro ao fazer upload.'); setUploading(false); return }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`

    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)

    onUpload(publicUrl)
    setUploading(false)
  }

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClass}>
        <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" className="object-cover" />
        <AvatarFallback className={`bg-neutral-100 text-neutral-700 font-bold ${textClass}`}>
          {initial}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1.5 hover:bg-neutral-800 transition-colors shadow-md"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </>
      )}
    </div>
  )
}
