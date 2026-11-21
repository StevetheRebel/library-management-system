export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  genreId: number;
  genre?: Genre;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BooksResponse {
  data: Book[];
  pagination: Pagination;
}
