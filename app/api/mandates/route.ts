import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const mandates = await prisma.cSRMandate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(mandates);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { companyName, objective, domains, state, city, budgetMin, budgetMax, yearsActiveMin, projectTimeline, verificationRequired } = body;

  if (!companyName || !domains || !state || !city) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const mandate = await prisma.cSRMandate.create({
    data: {
      userId: user.id,
      companyName,
      objective: objective || "",
      domains,
      state,
      city,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      yearsActiveMin: yearsActiveMin ? Number(yearsActiveMin) : null,
      projectTimeline: projectTimeline || null,
      verificationRequired: verificationRequired || null,
    },
  });

  return NextResponse.json(mandate);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.cSRMandate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}