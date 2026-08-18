import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../services/book.service';

export function useBooks(initialParams = {}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchBooks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await bookService.getAll({ ...initialParams, ...params });
      setBooks(data.books || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching books:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(initialParams); }, []);

  return { books, loading, total, pages, fetchBooks };
}

export function useBook(slug) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    bookService.getBySlug(slug)
      .then((data) => setBook(data.book))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return { book, loading };
}
