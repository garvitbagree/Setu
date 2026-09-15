import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ngo = await prisma.nGO.findUnique({
    where: { id: Number(id) },
    include: { projects: { orderBy: { createdAt: "desc" } } },
  });

  if (!ngo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(ngo);
}