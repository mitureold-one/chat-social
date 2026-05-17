'use client'

import { useGroupChatPage } from '@/hooks/useGroupChatPage'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { GroupJoinCard } from '@/_components/groups/GroupJoinCard'
import { GroupHeader } from '@/_components/groups/GroupHeader'
import { GroupMessages } from '@/_components/groups/GroupMessages'
import { GroupMessageComposer } from '@/_components/groups/GroupMessageComposer'
import { ChatSkeleton } from '@/_components/ui/skeletons'

export default function GroupChatPage() {
  const chat = useGroupChatPage()

  if (chat.pageLoading) return <ChatSkeleton />

  if (!chat.isMember && chat.group) {
    return (
      <GroupJoinCard
        name={chat.group.name}
        isPrivate={chat.group.is_private}
        password={chat.password}
        pwError={chat.pwError}
        onPasswordChange={value => {
          chat.setPassword(value)
          chat.setPwError('')
        }}
        onJoin={chat.handleJoin}
        onBack={chat.back}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      <GroupHeader
        name={chat.group?.name ?? ''}
        isPrivate={!!chat.group?.is_private}
        isOwner={chat.profile?.id === chat.group?.created_by}
        onBack={chat.back}
        onDelete={chat.handleDelete}
        onLeave={chat.handleLeave}
      />
      <ScrollArea className="flex-1 px-6 py-4">
        <GroupMessages messages={chat.messages} currentUserId={chat.profile?.id ?? ''} bottomRef={chat.bottomRef} />
      </ScrollArea>
      <GroupMessageComposer
        value={chat.newMessage}
        loading={chat.loading}
        onChange={chat.setNewMessage}
        onSend={chat.sendMessage}
      />
    </div>
  )
}