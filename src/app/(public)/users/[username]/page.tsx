import type { Metadata } from "next"

import { getCurrentUser, getUserByUsername } from "@/entities/user/api/queries"
import { UserProfile } from "@/widgets/user-profile-card"
import { UserNotFoundView } from "@/views/user-profile"
import { Container } from "@/shared/ui"

type UserProfilePageProps = {
  params: Promise<{ username: string }>
}

async function getProfilePageData(username: string) {
  const [profile, currentUser] = await Promise.all([
    getUserByUsername(username),
    getCurrentUser(),
  ])

  return { profile, currentUser }
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const { profile } = await getProfilePageData(username)

  return {
    title: profile ? username : "Пользователь не найден",
  }
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params
  const { profile, currentUser } = await getProfilePageData(username)

  if (!profile) {
    return <UserNotFoundView />
  }

  return (
    <Container>
      <UserProfile
        profile={profile}
        isOwnProfile={profile.id === currentUser?.id}
      />
    </Container>
  )
}
