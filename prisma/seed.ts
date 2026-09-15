import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const domains = ["Education", "Environment", "Healthcare", "Livelihood", "Disaster Relief", "Women Empowerment", "Skill Development", "Sanitation"];

const cities = [
  { city: "Chennai", state: "Tamil Nadu" }, { city: "Coimbatore", state: "Tamil Nadu" }, { city: "Madurai", state: "Tamil Nadu" },
  { city: "Mumbai", state: "Maharashtra" }, { city: "Pune", state: "Maharashtra" }, { city: "Nagpur", state: "Maharashtra" },
  { city: "New Delhi", state: "Delhi" },
  { city: "Bengaluru", state: "Karnataka" }, { city: "Mysuru", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Kolkata", state: "West Bengal" }, { city: "Howrah", state: "West Bengal" },
  { city: "Ahmedabad", state: "Gujarat" }, { city: "Surat", state: "Gujarat" }, { city: "Vadodara", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" }, { city: "Udaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" }, { city: "Noida", state: "Uttar Pradesh" }, { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" }, { city: "Indore", state: "Madhya Pradesh" },
  { city: "Patna", state: "Bihar" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Guwahati", state: "Assam" },
];

const domainNameParts: Record<string, string[]> = {
  Education: ["Vidya", "Gyan", "Shiksha", "Akshar", "Pathshala", "Bodhi"],
  Environment: ["Prakriti", "Harit", "Vasundhara", "Neer", "Tarumitra", "Paryavaran"],
  Healthcare: ["Arogya", "Swasthya", "Jeevan", "Sanjeevani", "Aarogyam", "Shifa"],
  Livelihood: ["Rozgar", "Swavalamban", "Udyam", "Kaushal", "Samriddhi", "Aajeevika"],
  "Disaster Relief": ["Sahayata", "Raksha", "Suraksha", "Punarvas", "Asha", "Sambhal"],
  "Women Empowerment": ["Shakti", "Nari", "Sakhi", "Ujjwala", "Saheli", "Sashakt"],
  "Skill Development": ["Kaushalya", "Pragati", "Hunar", "Disha", "Margdarshan", "Vikas"],
  Sanitation: ["Swachh", "Jal", "Nirmal", "Swasth", "Suvidha", "Paani"],
};

const suffixes = ["Foundation", "Trust", "Sansthan", "Seva Samiti", "Welfare Society", "Mission", "Initiative", "Sangathan"];

const firstNames = ["Priya", "Rajesh", "Anjali", "Vikram", "Meera", "Arjun", "Kavita", "Suresh", "Neha", "Amit", "Deepa", "Rahul", "Sunita", "Manoj", "Pooja"];
const lastNames = ["Sharma", "Verma", "Iyer", "Reddy", "Gupta", "Nair", "Mehta", "Joshi", "Patel", "Rao", "Singh", "Bose", "Chatterjee", "Menon"];

const projectTemplatesByDomain: Record<string, { title: string; achievement: string }[]> = {
  Education: [
    { title: "After-school learning centers", achievement: "Improved reading levels for 800+ children in 2 years" },
    { title: "Digital classroom initiative", achievement: "Equipped 40 government schools with tablets and internet" },
    { title: "Scholarship program for girls", achievement: "Funded higher education for 250 girls since inception" },
  ],
  Environment: [
    { title: "Urban afforestation drive", achievement: "Planted and maintained 15,000 saplings across 3 districts" },
    { title: "Lake restoration project", achievement: "Revived 4 dying urban lakes, restoring local groundwater levels" },
    { title: "Community composting program", achievement: "Diverted 500+ tonnes of waste from landfills annually" },
  ],
  Healthcare: [
    { title: "Mobile health clinics", achievement: "Provided free checkups to 12,000+ rural patients last year" },
    { title: "Maternal health outreach", achievement: "Reduced local maternal mortality cases by supporting 3,000 pregnancies" },
    { title: "Eye care camps", achievement: "Performed 1,800 free cataract surgeries in underserved areas" },
  ],
  Livelihood: [
    { title: "Women's self-help groups", achievement: "Enabled 600 women to start micro-enterprises" },
    { title: "Farmer income diversification", achievement: "Trained 900 farmers in sustainable second-income practices" },
    { title: "Artisan market linkage program", achievement: "Connected 200 rural artisans directly to urban retailers" },
  ],
  "Disaster Relief": [
    { title: "Flood response and rehabilitation", achievement: "Provided emergency shelter to 5,000 displaced families" },
    { title: "Disaster preparedness training", achievement: "Trained 150 village-level disaster response teams" },
    { title: "Post-cyclone rebuilding initiative", achievement: "Rebuilt 320 homes after a major coastal cyclone" },
  ],
  "Women Empowerment": [
    { title: "Legal aid and awareness cells", achievement: "Supported 1,200 women through legal counseling" },
    { title: "Vocational training for widows", achievement: "Trained and placed 400 widows in stable employment" },
    { title: "Safe spaces program", achievement: "Established 25 community safe spaces across 3 cities" },
  ],
  "Skill Development": [
    { title: "IT skills bootcamp for youth", achievement: "Placed 500+ graduates in entry-level tech jobs" },
    { title: "Vocational training centers", achievement: "Certified 2,000 youth in trades like electrical and plumbing" },
    { title: "Entrepreneurship incubator", achievement: "Helped launch 80 youth-led small businesses" },
  ],
  Sanitation: [
    { title: "Household toilet construction", achievement: "Built 3,500 household toilets in rural clusters" },
    { title: "School sanitation upgrade", achievement: "Renovated WASH facilities in 60 government schools" },
    { title: "Clean water access program", achievement: "Installed 45 community water purification units" },
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function main() {
  await prisma.ngoProject.deleteMany();
  await prisma.eOI.deleteMany();
  await prisma.shortlist.deleteMany();
  await prisma.nGO.deleteMany();

  let created = 0;
  let attempts = 0;
  const usedNames = new Set<string>();

  while (created < 150 && attempts < 1000) {
    attempts++;
    const domain = pick(domains);
    const namePart = pick(domainNameParts[domain]);
    const suffix = pick(suffixes);
    const name = `${namePart} ${suffix}`;

    if (usedNames.has(name)) continue;
    usedNames.add(name);

    const loc = pick(cities);
    const budgetMin = (Math.floor(Math.random() * 8) + 1) * 40000;
    const teamSize = Math.floor(Math.random() * 60) + 5;
    const yearsActive = Math.floor(Math.random() * 20) + 1;

    const boardMembers = pickN(
      Array.from({ length: 6 }, () => `${pick(firstNames)} ${pick(lastNames)}`),
      3
    ).map((n, i) => `${n} (${["Chair", "Treasurer", "Secretary"][i]})`).join(", ");

    const ngo = await prisma.nGO.create({
      data: {
        name,
        verified: Math.random() > 0.2,
        domain,
        city: loc.city,
        state: loc.state,
        address: `${loc.city} main road`,
        budgetMin,
        budgetMax: budgetMin + 80000 + Math.floor(Math.random() * 200000),
        yearsActive,
        impactMetric: `${(Math.floor(Math.random() * 20) + 1) * 250}+ beneficiaries reached`,
        description: `${name} is a ${domain.toLowerCase()}-focused organisation working in ${loc.city} and surrounding areas, active since ${new Date().getFullYear() - yearsActive}.`,
        has12A: Math.random() > 0.2,
        has80G: Math.random() > 0.2,
        hasFCRA: Math.random() > 0.5,
        pastCSRPartners: pickN(["TCS", "Infosys", "Wipro", "HDFC Bank", "Reliance Foundation", "Mahindra Group", "ICICI Bank", "Godrej"], 3).join(", "),
        teamSize,
        boardMembers,
        websiteUrl: `www.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`,
      },
    });

    const projectPool = projectTemplatesByDomain[domain];
    const numProjects = Math.floor(Math.random() * 3) + 1;
    const chosenProjects = pickN(projectPool, Math.min(numProjects, projectPool.length));

    for (const p of chosenProjects) {
      await prisma.ngoProject.create({
        data: {
          ngoId: ngo.id,
          title: p.title,
          description: `Ongoing effort under ${name}'s ${domain.toLowerCase()} programming.`,
          status: Math.random() > 0.4 ? "ongoing" : "completed",
          achievement: p.achievement,
        },
      });
    }

    created++;
  }

  console.log(`Seeded ${created} fictional NGOs with projects across ${domains.length} domains and ${cities.length} cities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });