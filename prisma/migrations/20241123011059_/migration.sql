/*
  Warnings:

  - You are about to drop the column `climateCompatibility` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `horsepower` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `Tractor` table. All the data in the column will be lost.
  - Added the required column `condition` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horsePower` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoursUsed` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `make` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Tractor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tractor" DROP COLUMN "climateCompatibility",
DROP COLUMN "horsepower",
DROP COLUMN "warranty",
ADD COLUMN     "condition" TEXT NOT NULL,
ADD COLUMN     "horsePower" INTEGER NOT NULL,
ADD COLUMN     "hoursUsed" INTEGER NOT NULL,
ADD COLUMN     "make" TEXT NOT NULL,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
