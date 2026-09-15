import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

async function getOwnedNgo() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;
  return prisma.nGO.findUnique({ where: { ownerUserId: user.id } });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ngoId = searchParams.get("ngoId");
  if (!ngoId) return NextResponse.json({ error: "Missing ngoId" }, { status: 400 });

  const projects = await prisma.ngoProject.findMany({
    where: { ngoId: Number(ngoId) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const ngo = await getOwnedNgo();
  if (!ngo) return NextResponse.json({ error: "No NGO found" }, { status: 404 });

  const { title, description, status, achievement } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const project = await prisma.ngoProject.create({
    data: { ngoId: ngo.id, title, description: description || "", status: status || "ongoing", achievement: achievement || null },
  });
  return NextResponse.json(project);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.ngoProject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}