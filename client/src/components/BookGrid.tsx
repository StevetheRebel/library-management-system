
import { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  RefreshCw,
  ArrowDownAZ,
  Library,
} from 'lucide-react';

import api from '../services/api';
import type { Book, BooksResponse } from '../types';
import BookCard from './BookCard';

interface BookGridProps {
  search: string;
  genreId: number | '';
}

type SortOption = 'default' | 'title' | 'author';

export default function BookGrid({ search, genreId }: BookGridProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get<BooksResponse>('/books', {
          params: {
            search: search || undefined,
            genreId: genreId || undefined,
          },
        });

        if (!cancelled) {
          setBooks(response.data.data);
        }
      } catch {
        if (!cancelled) {
          setError('We could not load the books. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [search, genreId, retryCount]);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }

    return 0;
  });

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  return (
    <section>
      {/* Catalogue toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Library size={21} />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Available books
            </p>
            <p className="text-xs text-slate-500">
              {loading ? 'Loading collection...' : `${books.length} books found`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
          <ArrowDownAZ size={17} className="text-slate-400" />

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            aria-label="Sort books"
            className="cursor-pointer bg-transparent py-2.5 text-sm text-slate-700 outline-none"
          >
            <option value="default">Default order</option>
            <option value="title">Sort by title</option>
            <option value="author">Sort by author</option>
          </select>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="h-44 animate-pulse bg-slate-200" />

              <div className="space-y-4 p-5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
          <AlertCircle size={36} className="mx-auto mb-4 text-red-500" />

          <h3 className="mb-2 font-semibold text-slate-900">
            Something went wrong
          </h3>

          <p className="mb-5 text-sm text-slate-600">{error}</p>

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && sortedBooks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <BookOpen size={32} />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            No books found
          </h3>

          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-500">
            We could not find books matching your search. Try another title,
            author or genre.
          </p>
        </div>
      )}

      {/* Book collection */}
      {!loading && !error && sortedBooks.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
