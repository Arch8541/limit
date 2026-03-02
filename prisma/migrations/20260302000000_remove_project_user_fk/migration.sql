-- Drop the foreign key constraint that links Project.userId → User.id
-- Project.userId now stores the Supabase Auth UUID directly (no FK required)
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_userId_fkey";

-- Drop old single-column index and replace with composite indexes from current schema
DROP INDEX IF EXISTS "Project_userId_idx";
DROP INDEX IF EXISTS "Project_status_idx";

-- Add composite indexes that match current schema
CREATE INDEX IF NOT EXISTS "Project_userId_createdAt_idx" ON "Project"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Project_userId_status_idx" ON "Project"("userId", "status");
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "Project_authority_zone_idx" ON "Project"("authority", "zone");
