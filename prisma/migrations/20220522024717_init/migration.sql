-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Student', 'Teacher');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" STRING NOT NULL,
    "password_hash" STRING NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" UUID NOT NULL,
    "name" STRING NOT NULL,
    "code" STRING NOT NULL,
    "open" BOOL NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentInClassroom" (
    "userId" UUID NOT NULL,
    "classroomId" UUID NOT NULL,
    "role" "Role" NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "text" STRING NOT NULL,
    "classroomId" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" UUID NOT NULL,
    "classroomId" UUID NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "text" STRING NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionChoice" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "text" STRING NOT NULL,
    "correct" BOOL NOT NULL,

    CONSTRAINT "QuestionChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResponse" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "quizId" UUID NOT NULL,

    CONSTRAINT "QuizResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionChoiceToQuizResponse" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "StudentInClassroom_userId_classroomId_key" ON "StudentInClassroom"("userId", "classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionChoiceToQuizResponse_AB_unique" ON "_QuestionChoiceToQuizResponse"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionChoiceToQuizResponse_B_index" ON "_QuestionChoiceToQuizResponse"("B");

-- AddForeignKey
ALTER TABLE "StudentInClassroom" ADD CONSTRAINT "StudentInClassroom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentInClassroom" ADD CONSTRAINT "StudentInClassroom_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionChoice" ADD CONSTRAINT "QuestionChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionChoiceToQuizResponse" ADD CONSTRAINT "_QuestionChoiceToQuizResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "QuestionChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionChoiceToQuizResponse" ADD CONSTRAINT "_QuestionChoiceToQuizResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "QuizResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
