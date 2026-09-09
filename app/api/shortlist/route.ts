import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { ngoId } = await req.json();

  if (!ngoId) {
    return NextResponse.json({ error: "Missing ngoId" }, { status: 400 });
  }

  const existing = await prisma.shortlist.findFirst({
    where: { userId: "demo-user", ngoId, status: "shortlisted" },
  });
  if (existing) return NextResponse.json(existing);

  const shortlist = await prisma.shortlist.create({
    data: { userId: "demo-user", ngoId, status: "shortlisted" },
  });

  return NextResponse.json(shortlist);
}

export async function GET() {
  const shortlists = await prisma.shortlist.findMany({
    where: { userId: "demo-user", status: "shortlisted" },
    include: { ngo: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(shortlists);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.shortlist.delete({ where: { id } });
  return NextResponse.json({ success: true });
}