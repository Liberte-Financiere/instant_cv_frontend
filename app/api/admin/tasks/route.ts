import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function isAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return session.user.role === 'ADMIN';
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tasks = await prisma.adminTask.findMany({
      orderBy: [
        { priority: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[ADMIN_TASKS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, status, priority, assignee } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Le titre est requis.' }, { status: 400 });
    }

    const validStatuses = ['todo', 'in_progress', 'testing', 'done'];
    const validPriorities = ['low', 'medium', 'high'];

    const task = await prisma.adminTask.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: validStatuses.includes(status) ? status : 'todo',
        priority: validPriorities.includes(priority) ? priority : 'medium',
        assignee: assignee?.trim() || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_TASKS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
