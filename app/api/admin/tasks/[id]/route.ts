import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function isAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return session.user.role === 'ADMIN';
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, status, priority, assignee } = body;

    const validStatuses = ['todo', 'in_progress', 'testing', 'done'];
    const validPriorities = ['low', 'medium', 'high'];

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined && validStatuses.includes(status)) updateData.status = status;
    if (priority !== undefined && validPriorities.includes(priority)) updateData.priority = priority;
    if (assignee !== undefined) updateData.assignee = assignee?.trim() || null;

    const task = await prisma.adminTask.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error: any) {
    console.error('[ADMIN_TASKS_PUT]', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tâche introuvable.' }, { status: 404 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    await prisma.adminTask.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ADMIN_TASKS_DELETE]', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tâche introuvable.' }, { status: 404 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}
