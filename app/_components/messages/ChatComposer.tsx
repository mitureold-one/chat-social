'use client'

import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { Separator } from '@/_components/ui/separator'

type ChatComposerProps = {
  value: string
  inputDisabled: boolean
  sendDisabled: boolean
  placeholder: string
  onChange: (value: string) => void
  onSend: () => void
}

export function ChatComposer({ value, inputDisabled, sendDisabled, placeholder, onChange, onSend }: ChatComposerProps) {
  return (
    <>
      <Separator />
      <div className="px-6 py-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
            disabled={inputDisabled}
          />
          <Button onClick={onSend} disabled={sendDisabled}>Enviar</Button>
        </div>
      </div>
    </>
  )
}