import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../services/book.service';
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const fetchBooks = useCallback(async (params = {}) => {
    setLoading(true);
    try { const d = await bookService.getAll(params); setBooks(d.books||[]); setTotal(d.total||0); setPages(d.pages||1); } catch(e){console.error(e.message);} finally{setLoading(false);}
  }, []);
  useEffect(()=>{fetchBooks();},[]);
  return { books, loading, total, pages, fetchBooks };
}
export function useBook(slug) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{ if(!slug) return; setLoading(true); bookService.getBySlug(slug).then(d=>setBook(d.book)).catch(()=>setBook(null)).finally(()=>setLoading(false)); },[slug]);
  return { book, loading };
}
