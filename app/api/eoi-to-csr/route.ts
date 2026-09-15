import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const ngo = await prisma.nGO.findUnique({ where: { ownerUserId: user.id } });
  if (!ngo) return NextResponse.json({ error: "No NGO registered for this account" }, { status: 400 });

  const { toMandateId, toUserId, message, proposedBudget } = await req.json();
  if (!toMandateId || !toUserId || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const eoi = await prisma.eOI.create({
    data: {
      direction: "ngo_to_csr",
      fromNgoId: ngo.id,
      toUserId,
      toMandateId,
      message,
      proposedBudget: proposedBudget || null,
      status: "pending",
    },
  });

  return NextResponse.json(eoi);
}