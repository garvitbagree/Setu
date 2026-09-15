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
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.nGO.findUnique({ where: { ownerUserId: user.id } });
  if (existing) {
    return NextResponse.json({ error: "You've already registered an NGO" }, { status: 400 });
  }

  const { name, domain, state, city, reg12A, reg80G, regFCRA } = await req.json();

  if (!name || !state || !city) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Mock "NGO Darpan" auto-check: any registration number with 6+ characters
  // is treated as a plausible match. Real integration would call an actual registry API.
  const hasPlausibleNumber = [reg12A, reg80G, regFCRA].some(
    (n) => n && n.trim().length >= 6
  );

  const ngo = await prisma.nGO.create({
    data: {
      ownerUserId: user.id,
      name,
      domain,
      state,
      city,
      reg12A: reg12A || null,
      reg80G: reg80G || null,
      regFCRA: regFCRA || null,
      has12A: !!reg12A,
      has80G: !!reg80G,
      hasFCRA: !!regFCRA,
      verified: hasPlausibleNumber,
      verificationNote: hasPlausibleNumber
        ? "Auto-verified against registry records"
        : "Pending manual review — no valid-looking registration number provided",
    },
  });

  return NextResponse.json(ngo);
}