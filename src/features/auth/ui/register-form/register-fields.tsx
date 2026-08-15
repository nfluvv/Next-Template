"use client"

import type { Control } from "react-hook-form"
import { useWatch } from "react-hook-form" // 💡 Импортируем хук слежения
import { PasswordStrengthIndicator } from "@/shared/ui" // Наш компонент полосочек

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/ui"

import type { RegisterFormValues } from "../../model/schema"

type RegisterFieldsProps = {
  control: Control<RegisterFormValues>
}

export function RegisterFields({ control }: RegisterFieldsProps) {
  // 💡 Подписываемся на изменение поля 'password' через переданный control.
  // Компонент будет перерендериваться и обновлять полосочки только при вводе пароля!
  const passwordValue = useWatch({
    control,
    name: "password",
  })

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Имя</FormLabel>
            <FormControl>
              <Input
                placeholder="Иван"
                autoComplete="name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input
                type="password"
                autoComplete="new-password"
                {...field}
              />
            </FormControl>
            
            {/* 💡 КЛАДЕМ ИНДИКАТОР СТРОГО СЮДА (внутри FormItem, под инпут) */}
            <PasswordStrengthIndicator password={passwordValue} />
            
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Повторите пароль</FormLabel>
            <FormControl>
              <Input
                type="password"
                autoComplete="new-password"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
