import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  BookMarked,
  Barcode,
  UserRound,
  Library,
  Tag,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import type { Book } from "../types";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Book>(`/books/${id}`);

        if (!cancelled) {
          setBook(response.data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load this book. It may not exist.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchBook();
    }

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <LoaderCircle
            size={36}
            className="mx-auto mb-4 animate-spin text-blue-600"
          />
          <p className="text-sm text-slate-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle size={38} className="mx-auto mb-4 text-red-500" />

          <h2 className="mb-2 text-xl font-bold text-slate-900">
            Book not found
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            {error || "We could not find the requested book."}
          </p>

          {error && (
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          )}

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 sm:px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Library size={22} />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
                Library Management System
              </p>
              <p className="text-xs text-slate-500">
                {book.title} - {book.genre?.name ?? "Uncategorised"}
              </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Back navigation */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to catalogue
        </Link>

        {/* Book details */}
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Book banner */}
          <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-linear-to-br from-blue-950 via-blue-800 to-indigo-700 px-6 py-12">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-sm">
              <BookOpen size={64} strokeWidth={1.2} />
            </div>

            <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white">
              Book record
            </span>
          </div>

          <div className="p-6 sm:p-10">
            {/* Title and genre */}
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <Tag size={14} />
                {book.genre?.name ?? "Uncategorised"}
              </span>

              <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {book.title}
              </h1>

              <p className="flex items-center gap-2 text-base text-slate-500">
                <UserRound size={19} />
                By {book.author}
              </p>
            </div>

            {/* Availability */}
            <div
              className={`mb-8 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
                isAvailable
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <CheckCircle2 size={26} className="text-emerald-600" />
                ) : (
                  <XCircle size={26} className="text-red-600" />
                )}

                <div>
                  <p
                    className={`font-semibold ${
                      isAvailable ? "text-emerald-800" : "text-red-800"
                    }`}
                  >
                    {isAvailable
                      ? "Available for borrowing"
                      : "Currently unavailable"}
                  </p>

                  <p className="text-sm text-slate-600">
                    {book.availableCopies} of {book.totalCopies} copies
                    available
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isAvailable
                    ? "bg-white text-emerald-700"
                    : "bg-white text-red-700"
                }`}
              >
                {isAvailable ? "In stock" : "Out of stock"}
              </span>
            </div>

            {/* Metadata */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <BookMarked size={20} className="text-blue-600" />
                Book information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <Barcode size={17} />
                    ISBN
                  </div>
                  <p className="font-semibold text-slate-900">{book.isbn}</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <Tag size={17} />
                    Genre
                  </div>
                  <p className="font-semibold text-slate-900">
                    {book.genre?.name ?? "Uncategorised"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <Library size={17} />
                    Total copies
                  </div>
                  <p className="font-semibold text-slate-900">
                    {book.totalCopies}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 size={17} />
                    Available copies
                  </div>
                  <p className="font-semibold text-slate-900">
                    {book.availableCopies}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-sm text-slate-500 sm:px-8">
          Library Management System.
        </div>
      </footer>
    </div>
  );
}
