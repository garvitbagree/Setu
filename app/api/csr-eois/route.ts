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

  const eois = await prisma.eOI.findMany({
    where: { toUserId: user.id, direction: "ngo_to_csr" },
    orderBy: { createdAt: "desc" },
    include: {
      fromNgo: { select: { name: true, domain: true, city: true, verified: true, ownerUserId: true } },
      mandate: { select: { companyName: true } },
    },
  });

  const enriched = await Promise.all(
    eois.map(async (eoi) => {
      if (eoi.status !== "accepted" || !eoi.fromNgo?.ownerUserId) {
        return { ...eoi, ngoContactName: null, ngoContactEmail: null };
      }
      const owner = await prisma.user.findUnique({ where: { id: eoi.fromNgo.ownerUserId } });
      return { ...eoi, ngoContactName: owner?.name ?? null, ngoContactEmail: owner?.email ?? null };
    })
  );

  return NextResponse.json(enriched);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id, status } = await req.json();
  if (!id || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const eoi = await prisma.eOI.findUnique({ where: { id } });
  if (!eoi || eoi.toUserId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.eOI.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}