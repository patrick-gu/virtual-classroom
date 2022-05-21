/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "name" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_name_key" ON "Classroom"("name");
