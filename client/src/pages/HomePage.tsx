import { useEffect, useState } from "react";
import { BookMarked, LibraryBig, Search, Sparkles } from "lucide-react";

import api from "../services/api";
import type { Genre } from "../types";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import BookGrid from "../components/BookGrid";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState<number | "">("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get<Genre[]>("/genres");
        setGenres(response.data);
      } catch {
        setError("Unable to load genres. Please try again.");
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <LibraryBig size={22} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                Library Management System
              </p>
              <p className="text-xs text-slate-500">
                Library project
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 sm:flex">
            <BookMarked size={16} />
            Digital catalogue
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Welcome section */}
        <section className="mb-10 overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
              <Sparkles size={14} />
              Your knowledge starts here
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Find your next great read.
            </h1>

            <p className="max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Explore the library catalogue, browse different genres and find
              the books you need.
            </p>
          </div>
        </section>

        {/* Catalogue section */}
        <section>
          <div className="mb-7">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Explore the collection
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Library catalogue
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search and filter books from the available collection.
            </p>
          </div>

          {/* Search and filters */}
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <Search size={20} className="shrink-0 text-slate-400" />
              <div className="w-full">
                <SearchBar onSearch={setSearch} />
              </div>
            </div>

            <div className="sm:w-56">
              <GenreFilter
                genres={genres}
                selectedGenreId={genreId}
                onGenreChange={setGenreId}
              />
            </div>
          </div>

          {error && (
            <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {loadingGenres && (
            <p className="mb-4 text-sm text-slate-500">Loading genres...</p>
          )}

          <BookGrid search={search} genreId={genreId} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Library Management System.</p>
          <p>Browse. Learn. Read.</p>
        </div>
      </footer>
    </div>
  );
}
