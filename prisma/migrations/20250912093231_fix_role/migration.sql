/*
  Warnings:

  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_modified_by_fkey";

-- DropTable
DROP TABLE "public"."roles";

-- CreateTable
CREATE TABLE "public"."Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "public"."Role"("role_name");

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "public"."User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
