import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { ArticleCard } from '../components/ui/ArticleCard';

export function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-sky-400" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Bookmarks</h1>
          <p className="text-slate-300 text-lg">{bookmarks.length === 0 ? 'No saved articles yet' : `${bookmarks.length} article${bookmarks.length !== 1 ? 's' : ''} saved`}</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">No Bookmarks Yet</h2>
            <p className="text-slate-500 mb-8">Start saving articles to read them later</p>
            <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors">Explore Articles</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{bookmarks.map((article) => <ArticleCard key={article.id} article={article} />)}</div>
        )}
      </main>
    </div>
  );
}
