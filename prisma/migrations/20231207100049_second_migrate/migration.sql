/*
  Warnings:

  - You are about to drop the `APIRequestLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAPIKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `APIRequestLog` DROP FOREIGN KEY `APIRequestLog_chat_message_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `APIRequestLog` DROP FOREIGN KEY `APIRequestLog_user_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `ChatItem` DROP FOREIGN KEY `ChatItem_user_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `ChatMessage` DROP FOREIGN KEY `ChatMessage_chat_item_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `ChatMessage` DROP FOREIGN KEY `ChatMessage_user_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserAPIKey` DROP FOREIGN KEY `UserAPIKey_model_primary_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserAPIKey` DROP FOREIGN KEY `UserAPIKey_user_primary_id_fkey`;

-- DropTable
DROP TABLE `APIRequestLog`;

-- DropTable
DROP TABLE `ChatItem`;

-- DropTable
DROP TABLE `ChatMessage`;

-- DropTable
DROP TABLE `Model`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `UserAPIKey`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(65, 30) NOT NULL,
    `isPremium` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `user_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(191) NOT NULL,
    `item_uuid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_primary_id` INTEGER NOT NULL,

    UNIQUE INDEX `chatItem_item_uuid_key`(`item_uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message_type` VARCHAR(191) NOT NULL,
    `message_content` VARCHAR(191) NOT NULL,
    `message_role` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chat_item_primary_id` INTEGER NOT NULL,
    `user_primary_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userApiKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `api_key` VARCHAR(191) NOT NULL,
    `user_primary_id` INTEGER NOT NULL,
    `model_primary_id` INTEGER NOT NULL,

    UNIQUE INDEX `userApiKey_api_key_key`(`api_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apiRequestLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cost` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chat_message_primary_id` INTEGER NOT NULL,
    `user_primary_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chatItem` ADD CONSTRAINT `chatItem_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatMessage` ADD CONSTRAINT `chatMessage_chat_item_primary_id_fkey` FOREIGN KEY (`chat_item_primary_id`) REFERENCES `chatItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatMessage` ADD CONSTRAINT `chatMessage_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userApiKey` ADD CONSTRAINT `userApiKey_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userApiKey` ADD CONSTRAINT `userApiKey_model_primary_id_fkey` FOREIGN KEY (`model_primary_id`) REFERENCES `model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apiRequestLog` ADD CONSTRAINT `apiRequestLog_chat_message_primary_id_fkey` FOREIGN KEY (`chat_message_primary_id`) REFERENCES `chatMessage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apiRequestLog` ADD CONSTRAINT `apiRequestLog_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
