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

export async function GET() {
  const ngo = await getOwnedNgo();
  if (!ngo) {
    return NextResponse.json({ error: "No NGO found" }, { status: 404 });
  }
  return NextResponse.json(ngo);
}

export async function PATCH(req: Request) {
  const ngo = await getOwnedNgo();
  if (!ngo) {
    return NextResponse.json({ error: "No NGO found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.nGO.update({
    where: { id: ngo.id },
    data: {
      description: body.description ?? ngo.description,
      impactMetric: body.impactMetric ?? ngo.impactMetric,
      yearsActive: body.yearsActive ?? ngo.yearsActive,
      budgetMin: body.budgetMin ?? ngo.budgetMin,
      budgetMax: body.budgetMax ?? ngo.budgetMax,
      pastCSRPartners: body.pastCSRPartners ?? ngo.pastCSRPartners,
    },
  });

  return NextResponse.json(updated);
}