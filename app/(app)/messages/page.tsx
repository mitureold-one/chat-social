'use client'

import { useMessagesPage } from '@/hooks/useMessagesPage'
import { UserList } from '@/_components/messages/UserList'
import { MessageListSkeleton } from '@/_components/ui/skeletons'

export default function MessagesPage() {
  const messages = useMessagesPage()

  if (messages.pageLoading) return <MessageListSkeleton />

  return (
    <UserList
      search={messages.search}
      users={messages.users}
      onSearchChange={messages.setSearch}
      onOpenChat={messages.openChat}
    />
  )
}
