/*
  Warnings:

  - Added the required column `image_urls` to the `chatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatMessage` ADD COLUMN `image_urls` JSON NOT NULL;
