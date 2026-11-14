import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const catalog = [
  {
    name: 'Fiction',
    description: 'Imaginary stories and literary works',
    books: [
      {
        title: 'Things Fall Apart',
        author: 'Chinua Achebe',
        isbn: '9780385474542',
        publishedYear: 1958,
        availableCopies: 5,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        publishedYear: 1925,
        availableCopies: 4,
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        publishedYear: 1949,
        availableCopies: 3,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928227',
        publishedYear: 1937,
        availableCopies: 6,
      },
    ],
  },
  {
    name: 'Science',
    description: 'Scientific discoveries and knowledge',
    books: [
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '9780553380163',
        publishedYear: 1988,
        availableCopies: 3,
      },
      {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        isbn: '9780198788607',
        publishedYear: 1976,
        availableCopies: 2,
      },
      {
        title: 'Cosmos',
        author: 'Carl Sagan',
        isbn: '9780345539434',
        publishedYear: 1980,
        availableCopies: 4,
      },
      {
        title: 'Silent Spring',
        author: 'Rachel Carson',
        isbn: '9780618249060',
        publishedYear: 1962,
        availableCopies: 3,
      },
    ],
  },
  {
    name: 'History',
    description: 'Historical events, people and civilizations',
    books: [
      {
        title: 'The Art of War',
        author: 'Sun Tzu',
        isbn: '9781590302255',
        publishedYear: -500,
        availableCopies: 4,
      },
      {
        title: 'Guns, Germs, and Steel',
        author: 'Jared Diamond',
        isbn: '9780393354324',
        publishedYear: 1997,
        availableCopies: 3,
      },
      {
        title: 'The Diary of a Young Girl',
        author: 'Anne Frank',
        isbn: '9780553296983',
        publishedYear: 1947,
        availableCopies: 5,
      },
      {
        title: 'Long Walk to Freedom',
        author: 'Nelson Mandela',
        isbn: '9780316548182',
        publishedYear: 1994,
        availableCopies: 2,
      },
    ],
  },
  {
    name: 'Technology',
    description: 'Computing, programming and technology',
    books: [
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publishedYear: 2008,
        availableCopies: 4,
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt and David Thomas',
        isbn: '9780135957059',
        publishedYear: 1999,
        availableCopies: 3,
      },
      {
        title: 'Design Patterns',
        author: 'Erich Gamma and others',
        isbn: '9780201633610',
        publishedYear: 1994,
        availableCopies: 2,
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen and others',
        isbn: '9780262046305',
        publishedYear: 2022,
        availableCopies: 3,
      },
    ],
  },
];

async function main() {
  for (const { name, description, books } of catalog) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: { description },
      create: { name, description },
    });

    for (const book of books) {
      await prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {
          ...book,
          genreId: genre.id,
        },
        create: {
          ...book,
          genreId: genre.id,
        },
      });
    }
  }

  const librarianName = process.env.LIBRARIAN_NAME;
  const librarianEmail = process.env.LIBRARIAN_EMAIL;
  const librariranPassword = process.env.LIBRARIAN_PASSWORD;

  if (!librarianName || !librarianEmail || !librariranPassword) {
    throw new Error('Librarian environment variables are missing.');
  }

  const existingLibrarian = await prisma.user.findUnique({
    where: { email: librarianEmail },
  });

  if (!existingLibrarian) {
    const hashedPassword = await bcrypt.hash(librariranPassword, 12);

    await prisma.user.create({
      data: {
        name: librarianName,
        email: librarianEmail,
        password: hashedPassword,
        role: 'LIBRARIAN',
      },
    });

    console.log('Librarian account created');
  } else {
    console.log('Librarian account already exists.');
  }

  console.log('Database seeding completed.');
  console.log('4 genres and 16 books processed.');
}

main()
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
