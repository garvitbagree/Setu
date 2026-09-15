/*
  Warnings:

  - You are about to alter the column `userId` on the `CSRMandate` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `companyName` to the `CSRMandate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CSRMandate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CSRMandate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CSRMandate" ("budgetMax", "budgetMin", "city", "createdAt", "domains", "id", "projectTimeline", "state", "userId", "verificationRequired", "yearsActiveMin") SELECT "budgetMax", "budgetMin", "city", "createdAt", "domains", "id", "projectTimeline", "state", "userId", "verificationRequired", "yearsActiveMin" FROM "CSRMandate";
DROP TABLE "CSRMandate";
ALTER TABLE "new_CSRMandate" RENAME TO "CSRMandate";
CREATE TABLE "new_EOI" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "direction" TEXT NOT NULL DEFAULT 'csr_to_ngo',
    "fromUserId" TEXT,
    "fromNgoId" INTEGER,
    "toNgoId" INTEGER,
    "toUserId" INTEGER,
    "toMandateId" INTEGER,
    "message" TEXT NOT NULL,
    "proposedBudget" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EOI_toNgoId_fkey" FOREIGN KEY ("toNgoId") REFERENCES "NGO" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EOI_fromNgoId_fkey" FOREIGN KEY ("fromNgoId") REFERENCES "NGO" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EOI_toMandateId_fkey" FOREIGN KEY ("toMandateId") REFERENCES "CSRMandate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_EOI" ("createdAt", "fromUserId", "id", "message", "proposedBudget", "status", "toNgoId") SELECT "createdAt", "fromUserId", "id", "message", "proposedBudget", "status", "toNgoId" FROM "EOI";
DROP TABLE "EOI";
ALTER TABLE "new_EOI" RENAME TO "EOI";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
