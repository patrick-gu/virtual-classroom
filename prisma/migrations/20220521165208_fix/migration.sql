/*
  Warnings:

  - You are about to drop the column `quizResponseId` on the `QuestionChoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuestionChoice" DROP CONSTRAINT "QuestionChoice_quizResponseId_fkey";

-- AlterTable
ALTER TABLE "QuestionChoice" DROP COLUMN "quizResponseId";

-- CreateTable
CREATE TABLE "_QuestionChoiceToQuizResponse" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionChoiceToQuizResponse_AB_unique" ON "_QuestionChoiceToQuizResponse"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionChoiceToQuizResponse_B_index" ON "_QuestionChoiceToQuizResponse"("B");

-- AddForeignKey
ALTER TABLE "_QuestionChoiceToQuizResponse" ADD CONSTRAINT "_QuestionChoiceToQuizResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "QuestionChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionChoiceToQuizResponse" ADD CONSTRAINT "_QuestionChoiceToQuizResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "QuizResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
