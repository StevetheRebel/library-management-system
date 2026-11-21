
import { SlidersHorizontal } from 'lucide-react';
import type { Genre } from '../types';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | '';
  onGenreChange: (genreId: number | '') => void;
}

export default function GenreFilter({
  genres,
  selectedGenreId,
  onGenreChange,
}: GenreFilterProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
      <SlidersHorizontal size={17} className="shrink-0 text-slate-400" />

      <select
        value={selectedGenreId}
        onChange={(event) => {
          const value = event.target.value;
          onGenreChange(value === '' ? '' : Number(value));
        }}
        aria-label="Filter books by genre"
        className="w-full cursor-pointer bg-transparent py-3 text-sm text-slate-700 outline-none"
      >
        <option value="">All genres</option>

        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}
