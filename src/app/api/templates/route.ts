import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.template.findMany({
      include: {
        tasks: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
