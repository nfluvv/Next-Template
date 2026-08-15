import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/shared/config/auth';
import { getAllUsers } from '@/entities/user/api/queries';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const data = await getAllUsers({ query, page });
  return NextResponse.json(data);
}