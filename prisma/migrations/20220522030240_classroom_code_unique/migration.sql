/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");
