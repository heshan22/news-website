import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ToastProvider } from './context/ToastContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BookmarkProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BookmarkProvider>
    </AuthProvider>
  </StrictMode>
);
