
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Barcode,
  BookOpen,
  UserRound,
  Library,
} from 'lucide-react';

import type { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

      {/* Book visual */}
      <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-blue-50 via-slate-50 to-indigo-100">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
          <BookOpen size={38} strokeWidth={1.5} />
        </div>

        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          {book.genre?.name ?? 'Uncategorised'}
        </span>
      </div>

      {/* Book information */}
      <div className="flex flex-1 flex-col p-5">

        <div className="mb-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isAvailable ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span
            className={`text-xs font-medium ${
              isAvailable ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {isAvailable
              ? `${book.availableCopies} copies available`
              : 'Currently unavailable'}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
          {book.title}
        </h3>

        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <UserRound size={16} />
          <span>{book.author}</span>
        </div>

        <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Barcode size={15} />
            <span>ISBN: {book.isbn}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <Library size={15} />
              {book.totalCopies} total copies
            </span>
          </div>

          <Link
            to={`/books/${book.id}`}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            View book details
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>
      </div>
    </article>
  );
}
