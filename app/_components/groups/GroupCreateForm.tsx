'use client'

import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/_components/ui/card'

type GroupCreateFormProps = {
  name: string
  description: string
  isPrivate: boolean
  password: string
  loading: boolean
  error: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onPrivateChange: (value: boolean) => void
  onPasswordChange: (value: string) => void
  onCancel: () => void
  onSubmit: () => void
}

export function GroupCreateForm({
  name,
  description,
  isPrivate,
  password,
  loading,
  error,
  onNameChange,
  onDescriptionChange,
  onPrivateChange,
  onPasswordChange,
  onCancel,
  onSubmit,
}: GroupCreateFormProps) {
  return (
    <div className="p-8 max-w-lg mx-auto">
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">Criar novo grupo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nome do grupo *</label>
            <Input placeholder="Ex: Turma de ES" value={name} onChange={e => onNameChange(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descrição</label>
            <Input placeholder="Sobre o que é esse grupo?" value={description} onChange={e => onDescriptionChange(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={e => onPrivateChange(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <label htmlFor="private" className="text-sm font-medium cursor-pointer">
              Grupo privado (exige senha para entrar)
            </label>
          </div>
          {isPrivate && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senha do grupo *</label>
              <Input
                type="password"
                placeholder="Senha que os membros usarão para entrar"
                value={password}
                onChange={e => onPasswordChange(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
          <Button onClick={onSubmit} disabled={loading} className="flex-1">
            {loading ? 'Criando...' : 'Criar grupo'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}