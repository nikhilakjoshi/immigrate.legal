import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseDetail = await prisma.case.findUnique({
      where: {
        id: id,
        lawyerId: session.user.id, // Ensure user can only access their own cases
      },
      include: {
        client: true,
        lawyer: {
          select: {
            name: true,
            email: true,
          },
        },
        template: {
          include: {
            tasks: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                name: true,
                email: true,
              },
            },
            documents: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        documents: true,
      },
    });

    if (!caseDetail) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseDetail);
  } catch (error) {
    console.error("Failed to fetch case details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
