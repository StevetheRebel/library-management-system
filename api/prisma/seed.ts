import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const catalog = [
  {
    name: "African Literature",
    books: [
      { title: "Things Fall Apart", author: "Chinua Achebe" },
      { title: "A Grain of Wheat", author: "Ngũgĩ wa Thiong’o" },
      { title: "The River and the Source", author: "Margaret Ogola" },
      { title: "Purple Hibiscus", author: "Chimamanda Ngozi Adichie" },
    ],
  },
  {
    name: "Science Fiction",
    books: [
      { title: "Dune", author: "Frank Herbert" },
      { title: "Kindred", author: "Octavia E. Butler" },
      { title: "The Martian", author: "Andy Weir" },
      { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" },
    ],
  },
  {
    name: "Mystery",
    books: [
      { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle" },
      { title: "The Moonstone", author: "Wilkie Collins" },
      {
        title: "The No. 1 Ladies’ Detective Agency",
        author: "Alexander McCall Smith",
      },
      { title: "Murder on the Orient Express", author: "Agatha Christie" },
    ],
  },
  {
    name: "Nonfiction",
    books: [
      { title: "Unbowed", author: "Wangari Maathai" },
      { title: "Becoming", author: "Michelle Obama" },
      {
        title: "The Immortal Life of Henrietta Lacks",
        author: "Rebecca Skloot",
      },
    ],
  },
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from api/.env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// saving each genre first
// uses ID to link the books

async function seed() {
  await prisma.$transaction(async (db) => {
    for (const { name, books } of catalog) {
      const genre = await db.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      });

      for (const { title, author } of books) {
        await db.book.upsert({
          where: { title_author: { title, author } },
          update: { genreId: genre.id },
          create: { title, author, genreId: genre.id },
        });
      }
    }
  });
}

// runs the seed, reports failure and closes the database
seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
