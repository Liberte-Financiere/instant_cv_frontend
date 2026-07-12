'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createActivity(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const author = session.user?.name || 'Admin';

  if (!title) {
    throw new Error('Le titre est requis');
  }

  await prisma.companyActivity.create({
    data: {
      title,
      description,
      type,
      author,
    },
  });

  revalidatePath('/dashboard/hq-ops/activities');
}

export async function deleteActivity(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  await prisma.companyActivity.delete({
    where: { id },
  });

  revalidatePath('/dashboard/hq-ops/activities');
}
