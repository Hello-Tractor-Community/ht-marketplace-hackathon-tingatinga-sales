/*
  Warnings:

  - You are about to drop the column `access_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `Authenticator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `credentialID` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `license_number` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `store_name` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `attachments_compatible` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `availability_status` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `climate_compatibility` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `engine_type_id` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `fuel_capacity` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `max_speed` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `operating_weight` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `serial_number` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `transmission_type` on the `Tractor` table. All the data in the column will be lost.
  - You are about to drop the column `wheel_type` on the `Tractor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[credentialId]` on the table `Authenticator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `SellerProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `Tractor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `Tractor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credentialId` to the `Authenticator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessName` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityStatus` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `climateCompatibility` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineTypeId` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelCapacity` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSpeed` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatingWeight` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmissionType` to the `Tractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wheelType` to the `Tractor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SellerProfile" DROP CONSTRAINT "SellerProfile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Tractor" DROP CONSTRAINT "Tractor_engine_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Tractor" DROP CONSTRAINT "Tractor_product_id_fkey";

-- DropIndex
DROP INDEX "Authenticator_credentialID_key";

-- DropIndex
DROP INDEX "Review_product_id_idx";

-- DropIndex
DROP INDEX "SellerProfile_user_id_key";

-- DropIndex
DROP INDEX "Tractor_product_id_key";

-- DropIndex
DROP INDEX "Tractor_serial_number_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "access_token",
DROP COLUMN "expires_at",
DROP COLUMN "id_token",
DROP COLUMN "refresh_token",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "expiresAt" INTEGER,
ADD COLUMN     "idToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "sessionState" TEXT,
ADD COLUMN     "tokenType" TEXT;

-- AlterTable
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_pkey",
DROP COLUMN "credentialID",
ADD COLUMN     "credentialId" TEXT NOT NULL,
ADD CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId", "credentialId");

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category_id",
DROP COLUMN "seller_id",
DROP COLUMN "stock_quantity",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SellerProfile" DROP COLUMN "business_name",
DROP COLUMN "created_at",
DROP COLUMN "license_number",
DROP COLUMN "phone_number",
DROP COLUMN "store_name",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "adminRemarks" TEXT,
ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "businessName" TEXT NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complianceStatus" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "preferredContactMethod" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "returnPolicy" TEXT,
ADD COLUMN     "shippingPolicy" TEXT,
ADD COLUMN     "socialLinks" TEXT[],
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Tractor" DROP COLUMN "attachments_compatible",
DROP COLUMN "availability_status",
DROP COLUMN "climate_compatibility",
DROP COLUMN "engine_type_id",
DROP COLUMN "fuel_capacity",
DROP COLUMN "max_speed",
DROP COLUMN "operating_weight",
DROP COLUMN "product_id",
DROP COLUMN "serial_number",
DROP COLUMN "transmission_type",
DROP COLUMN "wheel_type",
ADD COLUMN     "attachmentsCompatible" TEXT[],
ADD COLUMN     "availabilityStatus" TEXT NOT NULL,
ADD COLUMN     "climateCompatibility" TEXT NOT NULL,
ADD COLUMN     "engineTypeId" TEXT NOT NULL,
ADD COLUMN     "fuelCapacity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxSpeed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "operatingWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ADD COLUMN     "transmissionType" TEXT NOT NULL,
ADD COLUMN     "wheelType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialId_key" ON "Authenticator"("credentialId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_userId_key" ON "SellerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tractor_productId_key" ON "Tractor"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Tractor_serialNumber_key" ON "Tractor"("serialNumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tractor" ADD CONSTRAINT "Tractor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tractor" ADD CONSTRAINT "Tractor_engineTypeId_fkey" FOREIGN KEY ("engineTypeId") REFERENCES "EngineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProfile" ADD CONSTRAINT "SellerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
