import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cases = await prisma.case.findMany({
      where: {
        lawyerId: session.user.id,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        template: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.error("Failed to fetch cases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, clientId, templateId, priority, dueDate } =
      body;

    if (!title || !clientId) {
      return NextResponse.json(
        { error: "Title and client are required" },
        { status: 400 }
      );
    }

    // Generate a unique case ID
    const caseId = `case-${Date.now()}`;

    const newCase = await prisma.case.create({
      data: {
        id: caseId,
        title,
        description,
        clientId,
        lawyerId: session.user.id,
        templateId: templateId || null,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "OPEN",
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        template: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    // If a template is selected, create tasks from the template
    if (templateId) {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        include: {
          tasks: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (template && template.tasks.length > 0) {
        await prisma.task.createMany({
          data: template.tasks.map((templateTask, index: number) => ({
            id: `task-${Date.now()}-${index}`,
            title: templateTask.title,
            description: templateTask.description,
            status: "PENDING" as const,
            priority: "MEDIUM" as const,
            order: templateTask.order,
            caseId: newCase.id,
            assigneeId: session.user.id,
            templateId: templateId,
          })),
        });
      }
    }

    return NextResponse.json(newCase);
  } catch (error) {
    console.error("Failed to create case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
