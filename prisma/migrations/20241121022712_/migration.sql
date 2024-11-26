/*
  Warnings:

  - A unique constraint covering the columns `[businessName]` on the table `SellerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_businessName_key" ON "SellerProfile"("businessName");
