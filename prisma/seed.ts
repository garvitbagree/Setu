import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const domains = ["Education", "Environment", "Healthcare", "Livelihood"];
const cities = [
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Pune", state: "Maharashtra" },
];

const names = [
  "Asha Foundation", "Teach for India", "Smile Foundation", "Pratham",
  "Akshaya Patra", "Goonj", "CRY India", "Nanhi Kali",
  "Seva Mandir", "SOS Children's Villages", "Barefoot College", "Magic Bus",
  "Vidya", "HelpAge India", "Youth4Jobs", "Swasth Foundation",
  "Waterlife India", "GreenPeace India", "Sankara Eye Foundation", "Muktangan",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await prisma.eOI.deleteMany();
  await prisma.shortlist.deleteMany();
  await prisma.nGO.deleteMany();

  for (const name of names) {
    const loc = pick(cities);
    const budgetMin = (Math.floor(Math.random() * 5) + 1) * 50000;
    await prisma.nGO.create({
      data: {
        name,
        verified: Math.random() > 0.3,
        domain: pick(domains),
        city: loc.city,
        state: loc.state,
        address: `${loc.city} main road`,
        budgetMin,
        budgetMax: budgetMin + 100000,
        yearsActive: Math.floor(Math.random() * 15) + 1,
        impactMetric: `${(Math.floor(Math.random() * 10) + 1) * 100}+ beneficiaries`,
        description: `${name} works on ${pick(domains).toLowerCase()} initiatives across ${loc.city}.`,
        has12A: Math.random() > 0.3,
        has80G: Math.random() > 0.3,
        hasFCRA: Math.random() > 0.5,
        pastCSRPartners: "TCS, Infosys, Wipro",
      },
    });
  }

  console.log(`Seeded ${names.length} NGOs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });