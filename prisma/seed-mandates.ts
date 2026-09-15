import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mandates = [
  { companyName: "Tata Consultancy Services", objective: "Digital literacy and school infrastructure for underserved children", domains: "Education", state: "Maharashtra", city: "Mumbai", budgetMin: 2000000, budgetMax: 5000000, yearsActiveMin: 5, projectTimeline: "1+ years", verificationRequired: "12A, 80G" },
  { companyName: "Infosys Foundation", objective: "Rural healthcare access and maternal health programs", domains: "Healthcare", state: "Karnataka", city: "Bengaluru", budgetMin: 3000000, budgetMax: 8000000, yearsActiveMin: 3, projectTimeline: "6 months - 1 year", verificationRequired: "12A, 80G, FCRA" },
  { companyName: "Wipro Cares", objective: "Reforestation and water conservation in drought-prone districts", domains: "Environment", state: "Tamil Nadu", city: "Chennai", budgetMin: 1500000, budgetMax: 4000000, yearsActiveMin: 2, projectTimeline: "1+ years", verificationRequired: "12A" },
  { companyName: "HDFC Bank Parivartan", objective: "Skill development and livelihood generation for rural youth", domains: "Livelihood", state: "Gujarat", city: "Ahmedabad", budgetMin: 2500000, budgetMax: 6000000, yearsActiveMin: 3, projectTimeline: "6 months - 1 year", verificationRequired: "80G" },
  { companyName: "Reliance Foundation", objective: "Disaster relief and rehabilitation infrastructure", domains: "Disaster Relief", state: "Maharashtra", city: "Pune", budgetMin: 5000000, budgetMax: 12000000, yearsActiveMin: 5, projectTimeline: "Under 3 months", verificationRequired: "12A, 80G, FCRA" },
  { companyName: "Mahindra Group CSR", objective: "Women-led micro-enterprise incubation", domains: "Women Empowerment", state: "Delhi", city: "New Delhi", budgetMin: 1000000, budgetMax: 3000000, yearsActiveMin: 2, projectTimeline: "1+ years", verificationRequired: "12A, 80G" },
  { companyName: "ICICI Foundation", objective: "Vocational training centres in tier-2 cities", domains: "Skill Development", state: "Uttar Pradesh", city: "Lucknow", budgetMin: 2000000, budgetMax: 4500000, yearsActiveMin: 3, projectTimeline: "6 months - 1 year", verificationRequired: "80G" },
  { companyName: "Larsen & Toubro CSR", objective: "Sanitation and clean water infrastructure in rural schools", domains: "Sanitation", state: "West Bengal", city: "Kolkata", budgetMin: 1800000, budgetMax: 4200000, yearsActiveMin: 2, projectTimeline: "3-6 months", verificationRequired: "12A" },
  { companyName: "Bajaj Finserv Foundation", objective: "Primary education support and digital classrooms", domains: "Education", state: "Karnataka", city: "Mysuru", budgetMin: 1200000, budgetMax: 3500000, yearsActiveMin: 2, projectTimeline: "1+ years", verificationRequired: "12A, 80G" },
  { companyName: "Godrej CSR Cell", objective: "Affordable healthcare camps in peri-urban clusters", domains: "Healthcare", state: "Maharashtra", city: "Nagpur", budgetMin: 2200000, budgetMax: 5500000, yearsActiveMin: 4, projectTimeline: "6 months - 1 year", verificationRequired: "12A, 80G, FCRA" },
];

async function main() {
  // Create or reuse a demo CSR user to own these mandates
  let demoUser = await prisma.user.findUnique({ where: { email: "csr-demo@setu.dev" } });
  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: { name: "Demo CSR Partner", email: "csr-demo@setu.dev", role: "csr" },
    });
  }

  await prisma.cSRMandate.deleteMany({ where: { userId: demoUser.id } });

  for (const m of mandates) {
    await prisma.cSRMandate.create({
      data: { ...m, userId: demoUser.id },
    });
  }

  console.log(`Seeded ${mandates.length} CSR mandates under demo user ${demoUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });