/*
  Warnings:

  - You are about to alter the column `description` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - Added the required column `language` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "language" VARCHAR(50) NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);
