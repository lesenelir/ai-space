/*
  Warnings:

  - Added the required column `balance` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `balance` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `isPremium` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `ChatItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(191) NOT NULL,
    `item_uuid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_primary_id` INTEGER NOT NULL,

    UNIQUE INDEX `ChatItem_item_uuid_key`(`item_uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatMessage` (
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
CREATE TABLE `Model` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAPIKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `api_key` VARCHAR(191) NOT NULL,
    `user_primary_id` INTEGER NOT NULL,
    `model_primary_id` INTEGER NOT NULL,

    UNIQUE INDEX `UserAPIKey_api_key_key`(`api_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `APIRequestLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cost` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chat_message_primary_id` INTEGER NOT NULL,
    `user_primary_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChatItem` ADD CONSTRAINT `ChatItem_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_chat_item_primary_id_fkey` FOREIGN KEY (`chat_item_primary_id`) REFERENCES `ChatItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAPIKey` ADD CONSTRAINT `UserAPIKey_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAPIKey` ADD CONSTRAINT `UserAPIKey_model_primary_id_fkey` FOREIGN KEY (`model_primary_id`) REFERENCES `Model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `APIRequestLog` ADD CONSTRAINT `APIRequestLog_chat_message_primary_id_fkey` FOREIGN KEY (`chat_message_primary_id`) REFERENCES `ChatMessage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `APIRequestLog` ADD CONSTRAINT `APIRequestLog_user_primary_id_fkey` FOREIGN KEY (`user_primary_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
