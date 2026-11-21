
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, onSearch]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="flex w-full items-center gap-2">
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title or author..."
        aria-label="Search books"
        className="w-full border-0 bg-transparent px-1 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}
