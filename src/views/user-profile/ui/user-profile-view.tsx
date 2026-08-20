import { notFound } from "next/navigation"

import { getCurrentUser, getUserByUsername } from "@/entities/user/api/queries"
import { UserProfile } from "@/widgets/user-profile-card"
import { Container } from "@/shared/client/ui"

type UserProfileViewProps = {
  username: string
}

export async function UserProfileView({ username }: UserProfileViewProps) {
  const [profile, currentUser] = await Promise.all([
    getUserByUsername(username),
    getCurrentUser(),
  ])

  if (!profile) notFound()

  return (
    <Container>
      <UserProfile
        profile={profile}
        isOwnProfile={profile.id === currentUser?.id}
      />
    </Container>
  )
}
