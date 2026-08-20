import { AvatarUploader } from "@/features/update-avatar"
import { ChangePasswordForm } from "@/features/change-password"
import { TwoFactorSettings } from "@/features/manage-two-factor"
import { UpdateNameForm } from "@/features/update-name"
import { UpdateUsernameForm } from "@/features/update-username"
import { DeleteAccountDialog } from "@/features/delete-account"
import { ChangeEmailForm } from "@/features/change-email"

import { SettingsRow } from "./SettingsRow"
import { SettingsSection } from "./SettingsSection"
import { ConnectedAccounts } from "./ConnectedAccounts"
import { useTranslations } from "next-intl"

type ProfileSettingsProps = {
  user: {
    id: string
    name: string | null
    username: string | null
    email: string
    image: string | null
    twoFactorEnabled: boolean
    accounts: Array<{ provider: string }>
  }
  userHasPassword: boolean
}

export function ProfileSettings({
  user,
  userHasPassword,
}: ProfileSettingsProps) {
  const t = useTranslations("userSettings")
  const connectedProviders = new Set(
    user.accounts.map((account) => account.provider)
  )

  return (
    <div className="space-y-6">
      <SettingsSection title={t("profile")} description={t("profileDesc")}>
        <SettingsRow title={t("avatarTitle")} description={t("avatarDesc")}>
          <AvatarUploader
            currentImage={user.image}
            fallback={(user.name ?? user.email).charAt(0).toUpperCase()}
          />
        </SettingsRow>

        <SettingsRow title={t("nameTitle")} description={t("nameDesc")}>
          <UpdateNameForm defaultName={user.name ?? ""} />
        </SettingsRow>

        <SettingsRow title={t("usernameTitle")} description={t("usernameDesc")}>
          <UpdateUsernameForm defaultUsername={user.username ?? ""} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("security")} description={t("securityDesc")}>
        {userHasPassword && (
          <SettingsRow title={t("2faTitle")} description={t("2faDesc")}>
            <TwoFactorSettings isEnabled={user.twoFactorEnabled} />
          </SettingsRow>
        )}

        <SettingsRow
          title={userHasPassword ? t("shangePassword") : t("setPassword")}
          description={
            userHasPassword ? t("changePasswordDesc") : t("setPasswordDesc")
          }
        >
          <ChangePasswordForm hasPassword={userHasPassword} />
        </SettingsRow>

        {user.accounts.length === 0 && (
          <SettingsRow title="Email" description={t("changeEmailDesc")}>
            <ChangeEmailForm
              currentEmail={user.email}
              hasPassword={userHasPassword}
              twoFactorEnabled={user.twoFactorEnabled}
            />
          </SettingsRow>
        )}
      </SettingsSection>

      <SettingsSection
        title={t("connectionsTitle")}
        description={t("connectionsDesc")}
      >
        <ConnectedAccounts
          google={connectedProviders.has("google")}
          github={connectedProviders.has("github")}
        />
      </SettingsSection>

      <SettingsSection
        title={t("dangerZoneTitle")}
        description={t("dangerZoneDesc")}
      >
        <SettingsRow
          title={t("deleteAccountTitle")}
          description={t("deleteAccountDesc")}
          destructive
        >
          <DeleteAccountDialog
            hasPassword={userHasPassword}
            twoFactorEnabled={user.twoFactorEnabled}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
