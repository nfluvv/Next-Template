'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/config/auth';
import { prisma } from '@/shared/api/prisma';
import { cloudinary } from '@/shared/lib/cloudinary';

const AVATAR_TRANSFORMATION = 'c_fill,g_auto,w_400,h_400';

type SignedUploadParams = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  transformation: string;
};

type GetUploadSignatureResult =
  | { success: true; data: SignedUploadParams }
  | { success: false; error: string };

export const getAvatarUploadSignature = async (): Promise<GetUploadSignatureResult> => {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Не авторизован' };
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !cloudName || !apiSecret) {
    return { success: false, error: 'Ошибка конфигурации сервера Cloudinary' };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'avatars';
  const publicId = session.user.id;

  const paramsToSign = {
    timestamp,
    folder,
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    transformation: AVATAR_TRANSFORMATION,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    success: true,
    data: { timestamp, signature, apiKey, cloudName, folder, publicId, transformation: AVATAR_TRANSFORMATION },
  };
};

type SaveAvatarResult = { success: true } | { success: false; error: string };

export const saveAvatarUrl = async (url: string): Promise<SaveAvatarResult> => {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Не авторизован' };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return { success: false, error: 'Ошибка конфигурации сервера Cloudinary' };
  }

  if (!url.startsWith(`https://res.cloudinary.com/${cloudName}/`)) {
    return { success: false, error: 'Некорректный источник изображения' };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: url },
  });

  revalidatePath('/settings');
  return { success: true };
};