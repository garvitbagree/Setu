import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { toNgoId, message, proposedBudget } = await req.json();

  if (!toNgoId || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const eoi = await prisma.eOI.create({
    data: {
      fromUserId: "demo-user",
      toNgoId,
      message,
      proposedBudget,
      status: "pending",
    },
  });

  return NextResponse.json(eoi);
}