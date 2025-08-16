/*
  Warnings:

  - Added the required column `category` to the `Products` table with a default value.
*/
-- AlterTable
ALTER TABLE "public"."Products" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other';

-- Update existing products with sample categories
UPDATE "public"."Products" SET "category" = CASE 
  WHEN "name" ILIKE '%phone%' OR "name" ILIKE '%laptop%' OR "name" ILIKE '%computer%' THEN 'Electronics'
  WHEN "name" ILIKE '%shirt%' OR "name" ILIKE '%pants%' OR "name" ILIKE '%dress%' THEN 'Clothing'
  WHEN "name" ILIKE '%book%' OR "name" ILIKE '%magazine%' THEN 'Books'
  WHEN "name" ILIKE '%chair%' OR "name" ILIKE '%table%' OR "name" ILIKE '%lamp%' THEN 'Home & Garden'
  WHEN "name" ILIKE '%ball%' OR "name" ILIKE '%bat%' OR "name" ILIKE '%gym%' THEN 'Sports'
  WHEN "name" ILIKE '%car%' OR "name" ILIKE '%tire%' OR "name" ILIKE '%oil%' THEN 'Automotive'
  WHEN "name" ILIKE '%vitamin%' OR "name" ILIKE '%medicine%' OR "name" ILIKE '%supplement%' THEN 'Health'
  WHEN "name" ILIKE '%toy%' OR "name" ILIKE '%game%' THEN 'Toys'
  ELSE 'Other'
END;

-- Remove the default constraint after updating existing data
ALTER TABLE "public"."Products" ALTER COLUMN "category" DROP DEFAULT;
