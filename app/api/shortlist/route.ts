import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

async function getUserId() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user?.id ? String(user.id) : null;
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { ngoId } = await req.json();
  if (!ngoId) {
    return NextResponse.json({ error: "Missing ngoId" }, { status: 400 });
  }

  const existing = await prisma.shortlist.findFirst({
    where: { userId, ngoId, status: "shortlisted" },
  });
  if (existing) return NextResponse.json(existing);

  const shortlist = await prisma.shortlist.create({
    data: { userId, ngoId, status: "shortlisted" },
  });

  return NextResponse.json(shortlist);
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const shortlists = await prisma.shortlist.findMany({
    where: { userId, status: "shortlisted" },
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