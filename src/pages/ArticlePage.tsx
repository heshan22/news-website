import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, User, Bookmark, BookmarkCheck, ChevronRight, Tag } from 'lucide-react';
import { supabase, type Article } from '../lib/supabase';
import { ArticleCard } from '../components/ui/ArticleCard';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

const categoryColors: Record<string, string> = {
  politics: 'bg-rose-500', business: 'bg-emerald-500', technology: 'bg-violet-500', sports: 'bg-orange-500',
  entertainment: 'bg-pink-500', health: 'bg-cyan-500', science: 'bg-indigo-500', world: 'bg-sky-500',
};

export function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { showToast } = useToast();
  const bookmarked = isBookmarked(id || '');

  useEffect(() => { if (id) fetchArticle(); }, [id]);

  async function fetchArticle() {
    setLoading(true);
    try {
      const { data } = await supabase.from('articles').select('*').eq('id', id).single();
      setArticle(data);
      if (data) {
        await supabase.from('articles').update({ views: data.views + 1 }).eq('id', id);
        const { data: related } = await supabase.from('articles').select('*').eq('category', data.category).neq('id', id).order('published_at', { ascending: false }).limit(3);
        setRelatedArticles(related || []);
      }
    } catch (e) { console.error(e); setArticle(null); }
    finally { setLoading(false); }
  }

  const handleBookmark = () => {
    if (!article) return;
    if (bookmarked) { removeBookmark(article.id); showToast('Article removed from bookmarks', 'info'); }
    else { addBookmark(article); showToast('Article saved to bookmarks', 'success'); }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" /></div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <Link to="/" className="text-sky-600 hover:underline">Go back to Home</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-900 py-3 px-4 text-sm text-slate-300">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-sky-400">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/explore?category=${article.category}`} className="hover:text-sky-400 capitalize">{article.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="truncate text-slate-500">{article.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`${categoryColors[article.category]} px-3 py-1 rounded-full text-sm font-semibold text-white uppercase`}>{article.category}</span>
            {article.is_breaking && <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold text-white animate-pulse">BREAKING</span>}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">{article.title}</h1>
          <p className="text-xl text-slate-600 mb-6">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{article.author}</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{formattedDate}</span></div>
            <div className="flex items-center gap-2"><Eye className="w-4 h-4" /><span>{article.views.toLocaleString()} views</span></div>
            <button onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${bookmarked ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}{bookmarked ? 'Saved' : 'Save'}
            </button>
          </div>
        </header>

        {article.image_url && <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shadow-lg"><img src={article.image_url} alt={article.title} className="w-full h-full object-cover" /></div>}
        <div className="prose prose-lg max-w-none"><p className="text-slate-700 leading-relaxed whitespace-pre-line">{article.content}</p></div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2"><Tag className="w-5 h-5" />Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag} to={`/explore?search=${tag}`} className="px-3 py-1.5 bg-slate-200 hover:bg-sky-100 text-slate-700 hover:text-sky-700 rounded-full text-sm transition-colors">#{tag}</Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {relatedArticles.length > 0 && (
        <section className="bg-white py-12 mt-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{relatedArticles.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
          </div>
        </section>
      )}
    </div>
  );
}
