import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Menu, X, Bookmark, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookmarks } from '../../context/BookmarkContext';

const navLinks = [{ path: '/', label: 'Home' }, { path: '/explore', label: 'Explore' }, { path: '/contact', label: 'Contact' }];
const categories = [
  { id: 'politics', label: 'Politics' }, { id: 'business', label: 'Business' }, { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' }, { id: 'entertainment', label: 'Entertainment' }, { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' }, { id: 'world', label: 'World' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  const { bookmarks } = useBookmarks();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Newspaper className="w-8 h-8 text-sky-400 group-hover:text-sky-300 transition-colors" />
            <span className="font-bold text-xl tracking-tight">NewsHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === link.path ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
            <div className="relative" onMouseEnter={() => setIsCategoryOpen(true)} onMouseLeave={() => setIsCategoryOpen(false)}>
              <button className="px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Categories</button>
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 bg-slate-800 rounded-lg shadow-xl py-2 min-w-[160px]">
                  {categories.map((cat) => (
                    <Link key={cat.id} to={`/explore?category=${cat.id}`}
                      className="block px-4 py-2 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      onClick={() => setIsCategoryOpen(false)}>{cat.label}</Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/bookmarks" className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Bookmarks">
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{bookmarks.length}</span>
              )}
            </Link>

            {isAdmin ? (
              <>
                <Link to="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors">
                  <Shield className="w-4 h-4" />Admin
                </Link>
                <button onClick={signOut} className="p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Sign Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 transition-colors">
                <User className="w-4 h-4" />Sign In
              </Link>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                  onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
              ))}
              <div className="px-4 py-2 text-slate-400 text-sm font-semibold">Categories</div>
              {categories.map((cat) => (
                <Link key={cat.id} to={`/explore?category=${cat.id}`}
                  className="px-8 py-2 hover:bg-slate-800 text-slate-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}>{cat.label}</Link>
              ))}
              {isAdmin ? (
                <>
                  <Link to="/admin" className="px-4 py-3 mt-2 rounded-lg bg-emerald-600 mx-4 text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="px-4 py-3 text-slate-300 hover:text-white">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="mx-4 mt-4 px-4 py-3 rounded-lg bg-sky-600 text-center font-semibold"
                  onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
