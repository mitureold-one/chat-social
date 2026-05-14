'use client'

import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { Lock } from 'lucide-react'

type GroupJoinCardProps = {
  name: string
  isPrivate: boolean
  password: string
  pwError: string
  onPasswordChange: (value: string) => void
  onJoin: () => void
  onBack: () => void
}

export function GroupJoinCard({
  name,
  isPrivate,
  password,
  pwError,
  onPasswordChange,
  onJoin,
  onBack,
}: GroupJoinCardProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="border border-neutral-200 rounded-2xl p-8 w-full max-w-sm text-center space-y-4">
        <div className="flex justify-center">
          {isPrivate ? <Lock size={32} className="text-neutral-400" /> : null}
        </div>
        <div>
          <h2 className="font-bold text-lg">{name}</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {isPrivate ? 'Grupo privado — insira a senha para entrar' : 'Grupo público — clique para entrar'}
          </p>
        </div>
        {isPrivate && (
          <div className="space-y-2 text-left">
            <Input
              type="password"
              placeholder="Senha do grupo"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
            />
            {pwError && <p className="text-xs text-red-500">{pwError}</p>}
          </div>
        )}
        <Button className="w-full" onClick={onJoin}>Entrar no grupo</Button>
        <Button variant="outline" className="w-full" onClick={onBack}>Voltar</Button>
      </div>
    </div>
  )
}