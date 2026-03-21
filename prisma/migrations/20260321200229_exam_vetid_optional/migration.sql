-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_vetId_fkey";

-- AlterTable
ALTER TABLE "exams" ALTER COLUMN "vetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
