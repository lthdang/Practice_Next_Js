-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "User_deleted_at_idx" ON "public"."User"("deleted_at");
