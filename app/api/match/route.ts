import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const domains = (searchParams.get("domains") || "")
    .split(",")
    .filter(Boolean);
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const budgetMin = searchParams.get("budgetMin");
  const budgetMax = searchParams.get("budgetMax");

  const ngos = await prisma.nGO.findMany();

  let filtered = ngos;

  if (domains.length > 0) {
    filtered = filtered.filter((ngo) => domains.includes(ngo.domain));
  }

  if (budgetMin && budgetMax) {
    const min = Number(budgetMin);
    const max = Number(budgetMax);
    filtered = filtered.filter((ngo) => ngo.budgetMax >= min && ngo.budgetMin <= max);
  }

  const scored = filtered.map((ngo) => {
    let score = 60;

    if (city && ngo.city.toLowerCase() === city.toLowerCase()) score += 25;
    else if (state && ngo.state.toLowerCase() === state.toLowerCase()) score += 15;

    score = Math.min(score, 99);

    return { ...ngo, matchScore: score };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json(scored);
}