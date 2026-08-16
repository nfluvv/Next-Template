"use client"

import {
  AvatarUploader,
  ChangePasswordForm,
  TwoFactorSettings,
  UpdateNameForm,
  UpdateUsernameForm,
  DeleteAccountDialog,
  ChangeEmailForm,
} from "@/features/user-profile"

import { SettingsRow } from "./SettingsRow"
import { SettingsSection } from "./SettingsSection"
import { ConnectedAccounts } from "./ConnectedAccounts"

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
  const connectedProviders = new Set(
    user.accounts.map((account) => account.provider)
  )

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Профиль"
        description="Основная информация вашего профиля."
      >
        <SettingsRow
          title="Аватар"
          description="Изображение, которое будет отображаться в вашем профиле."
        >
          <AvatarUploader
            currentImage={user.image}
            fallback={(user.name ?? user.email).charAt(0).toUpperCase()}
          />
        </SettingsRow>

        <SettingsRow
          title="Имя"
          description="Отображаемое имя, которое видят другие пользователи."
        >
          <UpdateNameForm defaultName={user.name ?? ""} />
        </SettingsRow>

        <SettingsRow
          title="Юзернейм"
          description="Уникальный идентификатор вашего профиля."
        >
          <UpdateUsernameForm defaultUsername={user.username ?? ""} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Безопасность"
        description="Настройки входа и защиты вашего аккаунта."
      >
        <SettingsRow
          title="Двухфакторная аутентификация"
          description="Дополнительный уровень защиты при входе в аккаунт."
        >
          <TwoFactorSettings isEnabled={user.twoFactorEnabled} />
        </SettingsRow>

        <SettingsRow
          title={userHasPassword ? "Смена пароля" : "Установка пароля"}
          description={
            userHasPassword
              ? "Обновите пароль для защиты вашего аккаунта."
              : "Добавьте пароль, чтобы дополнительно защитить аккаунт."
          }
        >
          <ChangePasswordForm hasPassword={userHasPassword} />
        </SettingsRow>

        {user.accounts.length === 0 && (
          <SettingsRow
            title="Email"
            description="Email для входа и уведомлений."
          >
            <ChangeEmailForm
              currentEmail={user.email}
              hasPassword={userHasPassword}
              twoFactorEnabled={user.twoFactorEnabled}
            />
          </SettingsRow>
        )}
      </SettingsSection>

      <SettingsSection
        title="Подключения"
        description="Внешние сервисы, связанные с вашим аккаунтом."
      >
        <ConnectedAccounts
          google={connectedProviders.has("google")}
          github={connectedProviders.has("github")}
        />
      </SettingsSection>

      <SettingsSection
        title="Опасная зона"
        description="Необратимые действия с аккаунтом."
      >
        <SettingsRow
          title="Удаление аккаунта"
          description="Это действие необратимо и удалит все ваши данные без возможности восстановления."
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
