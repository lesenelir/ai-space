/*
  Warnings:

  - You are about to drop the `apiRequestLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cost_tokens` to the `chatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `apiRequestLog` DROP FOREIGN KEY `apiRequestLog_chat_message_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `apiRequestLog` DROP FOREIGN KEY `apiRequestLog_user_primary_id_fkey`;

-- AlterTable
ALTER TABLE `chatMessage` ADD COLUMN `cost_tokens` INTEGER NOT NULL;

-- DropTable
DROP TABLE `apiRequestLog`;
