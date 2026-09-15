import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const mandates = await prisma.cSRMandate.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(mandates);
}