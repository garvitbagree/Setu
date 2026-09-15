import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cities = [
  { city: "Mumbai", state: "Maharashtra" }, { city: "Pune", state: "Maharashtra" }, { city: "Nagpur", state: "Maharashtra" },
  { city: "Bengaluru", state: "Karnataka" }, { city: "Mysuru", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" }, { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "New Delhi", state: "Delhi" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Ahmedabad", state: "Gujarat" }, { city: "Surat", state: "Gujarat" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" }, { city: "Noida", state: "Uttar Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
];

const domains = ["Education", "Environment", "Healthcare", "Livelihood", "Disaster Relief", "Women Empowerment", "Skill Development", "Sanitation"];
const timelines = ["Under 3 months", "3-6 months", "6 months - 1 year", "1+ years"];

const objectivesByDomain: Record<string, string[]> = {
  Education: ["Digital literacy and school infrastructure for underserved children", "Scholarship and mentorship programs for first-generation learners", "Building libraries and learning centers in rural districts"],
  Environment: ["Reforestation and water conservation in drought-prone districts", "Renewable energy access for rural communities", "Urban waste management and recycling infrastructure"],
  Healthcare: ["Rural healthcare access and maternal health programs", "Mobile health clinics for underserved communities", "Nutrition and child health interventions"],
  Livelihood: ["Skill development and livelihood generation for rural youth", "Micro-enterprise support for small farmers", "Artisan market access programs"],
  "Disaster Relief": ["Disaster relief and rehabilitation infrastructure", "Flood-resistant housing construction", "Emergency preparedness training for vulnerable communities"],
  "Women Empowerment": ["Women-led micro-enterprise incubation", "Legal aid and safety programs for women", "Vocational training centers for women re-entering the workforce"],
  "Skill Development": ["Vocational training centres in tier-2 cities", "IT and digital skills bootcamps for unemployed youth", "Apprenticeship programs with local industry"],
  Sanitation: ["Sanitation and clean water infrastructure in rural schools", "Community toilet construction programs", "Water purification access initiatives"],
};

const companies = [
  "Tata Consultancy Services", "Infosys Foundation", "Wipro Cares", "HDFC Bank Parivartan",
  "Reliance Foundation", "Mahindra Group CSR", "ICICI Foundation", "Larsen & Toubro CSR",
  "Bajaj Finserv Foundation", "Godrej CSR Cell", "Aditya Birla CSR", "JSW Foundation",
  "Adani Foundation", "Hindustan Unilever Foundation", "ITC CSR", "Cipla Foundation",
  "Dr. Reddy's Foundation", "Sun Pharma CSR", "Axis Bank Foundation", "Kotak Mahindra CSR",
  "State Bank of India Foundation", "Maruti Suzuki CSR", "Hero MotoCorp CSR", "Bharti Foundation",
  "Vedanta CSR", "NTPC Foundation", "ONGC CSR", "Coal India CSR",
  "Indian Oil Foundation", "Britannia CSR", "Nestle India CSR", "Colgate-Palmolive India CSR",
  "Procter & Gamble India CSR", "Asian Paints CSR", "UltraTech Cement CSR",
  "JSW Steel Foundation", "Tata Steel CSR", "Tata Power CSR", "Tata Motors CSR",
  "Hindalco CSR", "Siemens India CSR", "Cognizant Foundation", "Accenture India CSR",
  "HCL Foundation", "Tech Mahindra Foundation", "Genpact Cares", "Capgemini India CSR",
  "DLF Foundation", "Yes Bank Foundation", "IndusInd Bank CSR", "L&T Finance CSR",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  let demoUser = await prisma.user.findUnique({ where: { email: "csr-demo@setu.dev" } });
  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: { name: "Demo CSR Partner", email: "csr-demo@setu.dev", role: "csr" },
    });
  }

  await prisma.cSRMandate.deleteMany({ where: { userId: demoUser.id } });

  for (const companyName of companies) {
    const loc = pick(cities);
    const domain = pick(domains);
    const budgetMin = (Math.floor(Math.random() * 8) + 2) * 500000;

    await prisma.cSRMandate.create({
      data: {
        userId: demoUser.id,
        companyName,
        objective: pick(objectivesByDomain[domain]),
        domains: domain,
        state: loc.state,
        city: loc.city,
        budgetMin,
        budgetMax: budgetMin + 1000000 + Math.floor(Math.random() * 3000000),
        yearsActiveMin: Math.floor(Math.random() * 4) + 1,
        projectTimeline: pick(timelines),
        verificationRequired: pick(["12A, 80G", "12A, 80G, FCRA", "80G", "12A"]),
      },
    });
  }

  console.log(`Seeded ${companies.length} CSR mandates under demo user ${demoUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });