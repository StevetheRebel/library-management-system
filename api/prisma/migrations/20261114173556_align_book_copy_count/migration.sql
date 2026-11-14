/*
  Warnings:

  - You are about to drop the column `availableCopies` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,author]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- Rename the column to preserve existing copy counts.
ALTER TABLE "Book"
RENAME COLUMN "availableCopies" TO "totalCopies";

-- Add a unique constraint for book title and author.
CREATE UNIQUE INDEX "Book_title_author_key"
ON "Book"("title", "author");
