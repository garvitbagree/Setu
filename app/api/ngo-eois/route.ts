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

  const eois = await prisma.eOI.findMany({
    where: { toNgoId: ngo.id },
    orderBy: { createdAt: "desc" },
  });

  // fromUserId is currently a placeholder string ("demo-user") from earlier
  // development, not a real numeric user id, so we can't reliably join to
  // the User table yet. We return what we have and leave contact fields
  // blank if no real user match exists.
  const enriched = await Promise.all(
    eois.map(async (eoi) => {
      const numericId = Number(eoi.fromUserId);
      let fromUserName: string | null = null;
      let fromUserEmail: string | null = null;
      if (!isNaN(numericId)) {
        const fromUser = await prisma.user.findUnique({ where: { id: numericId } });
        fromUserName = fromUser?.name ?? null;
        fromUserEmail = fromUser?.email ?? null;
      }
      return { ...eoi, fromUserName, fromUserEmail };
    })
  );

  return NextResponse.json(enriched);
}

export async function PATCH(req: Request) {
  const ngo = await getOwnedNgo();
  if (!ngo) {
    return NextResponse.json({ error: "No NGO found" }, { status: 404 });
  }

  const { id, status } = await req.json();
  if (!id || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const eoi = await prisma.eOI.findUnique({ where: { id } });
  if (!eoi || eoi.toNgoId !== ngo.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.eOI.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}