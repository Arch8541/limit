-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "authority" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "plotLength" REAL NOT NULL,
    "plotWidth" REAL NOT NULL,
    "plotArea" REAL NOT NULL,
    "isCornerPlot" BOOLEAN NOT NULL DEFAULT false,
    "roadWidthPrimary" REAL NOT NULL,
    "roadWidthSecondary" REAL,
    "intendedUse" TEXT NOT NULL,
    "heritage" BOOLEAN NOT NULL DEFAULT false,
    "toz" BOOLEAN NOT NULL DEFAULT false,
    "sez" BOOLEAN NOT NULL DEFAULT false,
    "regulationResult" TEXT,
    "gdcrClauses" TEXT,
    "extractedData" TEXT,
    "reportId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "thumbnail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");
