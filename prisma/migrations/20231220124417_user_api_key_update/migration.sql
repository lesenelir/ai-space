/*
  Warnings:

  - A unique constraint covering the columns `[user_primary_id,model_primary_id]` on the table `userApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `userApiKey_user_primary_id_model_primary_id_key` ON `userApiKey`(`user_primary_id`, `model_primary_id`);
