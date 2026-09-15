-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NGO" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NGO_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NGO" ("address", "budgetMax", "budgetMin", "city", "createdAt", "description", "domain", "has12A", "has80G", "hasFCRA", "id", "impactMetric", "name", "pastCSRPartners", "photoUrl", "state", "verified", "yearsActive") SELECT "address", "budgetMax", "budgetMin", "city", "createdAt", "description", "domain", "has12A", "has80G", "hasFCRA", "id", "impactMetric", "name", "pastCSRPartners", "photoUrl", "state", "verified", "yearsActive" FROM "NGO";
DROP TABLE "NGO";
ALTER TABLE "new_NGO" RENAME TO "NGO";
CREATE UNIQUE INDEX "NGO_ownerUserId_key" ON "NGO"("ownerUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
