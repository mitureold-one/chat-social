import { ScrollArea } from '@/_components/ui/scroll-area'

type Message = {
  id: string
  sender_id: string
  content: string
}

type ChatMessagesProps = {
  messages: Message[]
  myProfileId: string
  bottomRef: React.RefObject<HTMLDivElement | null>
}

export function ChatMessages({ messages, myProfileId, bottomRef }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 px-6 py-4">
      <div className="space-y-4 max-w-2xl mx-auto">
        {messages.map(msg => {
          const isOwn = msg.sender_id === myProfileId
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-2xl px-4 py-2 text-sm max-w-[70%] ${
                isOwn ? 'bg-black text-white' : 'bg-neutral-100 text-black'
              }`}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}