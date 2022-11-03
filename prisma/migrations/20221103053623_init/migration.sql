/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classNumber` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `classNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `dob` DATETIME(3) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `photo` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `post`;

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);
