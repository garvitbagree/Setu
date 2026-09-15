-- AlterTable
ALTER TABLE "NGO" ADD COLUMN "boardMembers" TEXT;
ALTER TABLE "NGO" ADD COLUMN "teamSize" INTEGER;
ALTER TABLE "NGO" ADD COLUMN "websiteUrl" TEXT;

-- CreateTable
CREATE TABLE "NgoProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ngoId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "achievement" TEXT,
    "startedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NgoProject_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
