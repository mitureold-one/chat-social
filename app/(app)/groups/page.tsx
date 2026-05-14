'use client'

import { useGroupsPage } from '@/hooks/useGroupsPage'
import { GroupList } from '@/_components/groups/GroupList'

export default function GroupsPage() {
  const groupsPage = useGroupsPage()

  return (
    <GroupList
      groups={groupsPage.groups}
      onCreate={groupsPage.onCreate}
      onOpenGroup={groupsPage.onOpenGroup}
    />
  )
}