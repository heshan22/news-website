import { createContext, useContext, useState, ReactNode } from 'react';
import type { Article } from '../lib/supabase';

interface BookmarkContextType {
  bookmarks: Article[];
  addBookmark: (article: Article) => void;
  removeBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    const saved = localStorage.getItem('newsBookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const addBookmark = (article: Article) => {
    setBookmarks((prev) => {
      const updated = [...prev, article];
      localStorage.setItem('newsBookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = (articleId: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((a) => a.id !== articleId);
      localStorage.setItem('newsBookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (articleId: string) => bookmarks.some((a) => a.id === articleId);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within a BookmarkProvider');
  return context;
}
