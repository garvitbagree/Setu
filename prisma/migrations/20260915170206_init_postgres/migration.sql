-- CreateTable
CREATE TABLE "NGO" (
    "id" SERIAL NOT NULL,
    "ownerUserId" INTEGER,
    "name" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationNote" TEXT,
    "domain" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT,
    "budgetMin" INTEGER NOT NULL DEFAULT 0,
    "budgetMax" INTEGER NOT NULL DEFAULT 0,
    "yearsActive" INTEGER NOT NULL DEFAULT 0,
    "impactMetric" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT,
    "has12A" BOOLEAN NOT NULL DEFAULT false,
    "has80G" BOOLEAN NOT NULL DEFAULT false,
    "hasFCRA" BOOLEAN NOT NULL DEFAULT false,
    "reg12A" TEXT,
    "reg80G" TEXT,
    "regFCRA" TEXT,
    "pastCSRPartners" TEXT,
    "teamSize" INTEGER,
    "boardMembers" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NgoProject" (
    "id" SERIAL NOT NULL,
    "ngoId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "achievement" TEXT,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NgoProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSRMandate" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "objective" TEXT NOT NULL DEFAULT '',
    "domains" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "budgetMin" INTEGER NOT NULL,
    "budgetMax" INTEGER NOT NULL,
    "yearsActiveMin" INTEGER,
    "projectTimeline" TEXT,
    "verificationRequired" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSRMandate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ngoId" INTEGER NOT NULL,
    "rank" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'shortlisted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EOI" (
    "id" SERIAL NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'csr_to_ngo',
    "fromUserId" TEXT,
    "fromNgoId" INTEGER,
    "toNgoId" INTEGER,
    "toUserId" INTEGER,
    "toMandateId" INTEGER,
    "message" TEXT NOT NULL,
    "proposedBudget" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EOI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NGO_ownerUserId_key" ON "NGO"("ownerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "NGO" ADD CONSTRAINT "NGO_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NgoProject" ADD CONSTRAINT "NgoProject_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSRMandate" ADD CONSTRAINT "CSRMandate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EOI" ADD CONSTRAINT "EOI_toNgoId_fkey" FOREIGN KEY ("toNgoId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EOI" ADD CONSTRAINT "EOI_fromNgoId_fkey" FOREIGN KEY ("fromNgoId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EOI" ADD CONSTRAINT "EOI_toMandateId_fkey" FOREIGN KEY ("toMandateId") REFERENCES "CSRMandate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
