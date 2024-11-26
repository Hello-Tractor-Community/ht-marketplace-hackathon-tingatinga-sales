/*
  Warnings:

  - You are about to drop the column `availabilityStatus` on the `Tractor` table. All the data in the column will be lost.
  - Added the required column `availabilityStatus` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availabilityStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tractor" DROP COLUMN "availabilityStatus",
ADD COLUMN     "warranty" TEXT,
ALTER COLUMN "operatingWeight" DROP NOT NULL;
