/*
  Warnings:

  - Added the required column `model_primary_id` to the `chatItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatItem` ADD COLUMN `model_primary_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `chatItem` ADD CONSTRAINT `chatItem_model_primary_id_fkey` FOREIGN KEY (`model_primary_id`) REFERENCES `model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
