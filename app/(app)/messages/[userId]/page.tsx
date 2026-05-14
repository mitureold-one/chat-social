'use client'

import { useDirectMessagePage } from '@/hooks/useDirectMessagePage'
import { ChatHeader } from '@/_components/messages/ChatHeader'
import { ChatMessages } from '@/_components/messages/ChatMessages'
import { ChatComposer } from '@/_components/messages/ChatComposer'

export default function DirectMessagePage() {
  const chat = useDirectMessagePage()

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        otherProfile={chat.otherProfile}
        onBack={chat.back}
      />

      <ChatMessages
        messages={chat.messages}
        myProfileId={chat.myProfile?.id ?? ''}
        bottomRef={chat.bottomRef}
      />

      <ChatComposer
        value={chat.newMessage}
        inputDisabled={false}
        sendDisabled={!chat.newMessage.trim() || chat.sending}
        placeholder={`Mensagem para ${chat.otherProfile?.full_name || chat.otherProfile?.username}...`}
        onChange={chat.setNewMessage}
        onSend={chat.sendMessage}
      />
    </div>
  )
}