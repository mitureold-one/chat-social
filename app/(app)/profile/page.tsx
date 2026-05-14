'use client'

import { useProfilePage } from '@/hooks/useProfilePage'
import { ProfileCard } from '@/_components/profile/ProfileCard'
import { ProfilePosts } from '@/_components/profile/ProfilePosts'

export default function ProfilePage() {
  const profilePage = useProfilePage()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-4 md:py-8">
        <ProfileCard
          profile={profilePage.profile}
          editing={profilePage.editing}
          fullName={profilePage.fullName}
          bio={profilePage.bio}
          saving={profilePage.saving}
          initial={profilePage.initial ?? '?'}
          postCount={profilePage.posts.length}
          onEdit={profilePage.startEditing}
          onCancel={profilePage.cancelEditing}
          onSave={profilePage.save}
          onLogout={profilePage.logout}
          onFullNameChange={profilePage.onFullNameChange}
          onBioChange={profilePage.onBioChange}
          onAvatarUpload={url => profilePage.updateAvatar(url)}
        />

        <ProfilePosts
          posts={profilePage.posts}
          currentUserId={profilePage.profile?.id ?? ''}
          onDelete={id => profilePage.removePost(id)}
        />
      </div>
    </div>
  )
}