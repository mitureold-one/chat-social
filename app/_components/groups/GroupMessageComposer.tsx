'use client'

import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'

type GroupMessageComposerProps = {
  value: string
  loading: boolean
  onChange: (value: string) => void
  onSend: () => void
}

export function GroupMessageComposer({ value, loading, onChange, onSend }: GroupMessageComposerProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex gap-2 max-w-2xl mx-auto">
        <Input
          placeholder="Mensagem no grupo..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && onSend()}
          disabled={loading}
        />
        <Button onClick={onSend} disabled={loading || !value.trim()}>Enviar</Button>
      </div>
    </div>
  )
}