import { Link } from 'react-router-dom';
import { Clock, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Article } from '../../lib/supabase';
import { useBookmarks } from '../../context/BookmarkContext';
import { useToast } from '../../context/ToastContext';

interface ArticleCardProps { article: Article; variant?: 'default' | 'featured' | 'compact'; }

const categoryColors: Record<string, string> = {
  politics: 'bg-rose-500', business: 'bg-emerald-500', technology: 'bg-violet-500', sports: 'bg-orange-500',
  entertainment: 'bg-pink-500', health: 'bg-cyan-500', science: 'bg-indigo-500', world: 'bg-sky-500',
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { showToast } = useToast();
  const bookmarked = isBookmarked(article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) { removeBookmark(article.id); showToast('Article removed from bookmarks', 'info'); }
    else { addBookmark(article); showToast('Article saved to bookmarks', 'success'); }
  };

  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.id}`} className="group block relative overflow-hidden rounded-2xl aspect-[16/9] bg-slate-900">
        {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`${categoryColors[article.category]} px-3 py-1 rounded-full text-xs font-semibold text-white uppercase`}>{article.category}</span>
            {article.is_breaking && <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white animate-pulse">BREAKING</span>}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">{article.title}</h2>
          <p className="text-slate-300 mb-3 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{article.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formattedDate}</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{article.views.toLocaleString()}</span>
          </div>
        </div>
        <button onClick={handleBookmark} className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 transition-colors">
          {bookmarked ? <BookmarkCheck className="w-5 h-5 text-sky-400" /> : <Bookmark className="w-5 h-5 text-white" />}
        </button>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.id}`} className="group flex gap-4 py-4 border-b border-slate-200 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors">
        {article.image_url && <img src={article.image_url} alt={article.title} className="w-24 h-20 object-cover rounded-lg flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${categoryColors[article.category]} px-2 py-0.5 rounded text-xs font-medium text-white`}>{article.category}</span>
            {article.is_breaking && <span className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white">BREAKING</span>}
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">{article.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{formattedDate}</p>
        </div>
        <button onClick={handleBookmark} className="p-1 self-center">
          {bookmarked ? <BookmarkCheck className="w-5 h-5 text-sky-500" /> : <Bookmark className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />}
        </button>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {article.image_url && (
        <div className="aspect-video overflow-hidden relative">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <button onClick={handleBookmark} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors">
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-sky-500" /> : <Bookmark className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`${categoryColors[article.category]} px-2.5 py-1 rounded-full text-xs font-semibold text-white uppercase`}>{article.category}</span>
          {article.is_breaking && <span className="bg-red-600 px-2.5 py-1 rounded-full text-xs font-bold text-white animate-pulse">BREAKING</span>}
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">{article.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3"><span>{article.author}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formattedDate}</span></div>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
