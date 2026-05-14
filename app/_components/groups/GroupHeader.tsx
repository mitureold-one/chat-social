'use client'

import { Button } from '@/_components/ui/button'
import { Badge } from '@/_components/ui/badge'
import { Lock, LogOut, Trash2 } from 'lucide-react'

type GroupHeaderProps = {
  name: string
  isPrivate: boolean
  isOwner: boolean
  onBack: () => void
  onDelete: () => void
  onLeave: () => void
}

export function GroupHeader({ name, isPrivate, isOwner, onBack, onDelete, onLeave }: GroupHeaderProps) {
  return (
    <header className="border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="text-neutral-400 hover:text-black text-sm shrink-0"
        >
          ←
        </button>
        <h1 className="font-bold tracking-tight text-sm md:text-base truncate">{name}</h1>
        {isPrivate && (
          <Badge variant="outline" className="text-xs shrink-0">
            <Lock size={10} className="mr-1" />Privado
          </Badge>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 px-2 md:px-3"
          >
            <Trash2 size={14} />
            <span className="hidden md:inline ml-1.5">Excluir</span>
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onLeave} className="px-2 md:px-3">
          <LogOut size={14} />
          <span className="hidden md:inline ml-1.5">Sair</span>
        </Button>
      </div>
    </header>
  )
}