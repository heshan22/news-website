import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import { supabase, type Article } from '../lib/supabase';
import { ArticleCard } from '../components/ui/ArticleCard';

export function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    try {
      const [featuredRes, breakingRes, latestRes] = await Promise.all([
        supabase.from('articles').select('*').eq('is_featured', true).order('published_at', { ascending: false }).limit(3),
        supabase.from('articles').select('*').eq('is_breaking', true).order('published_at', { ascending: false }).limit(5),
        supabase.from('articles').select('*').order('published_at', { ascending: false }).limit(6),
      ]);
      setFeaturedArticles(featuredRes.data || []);
      setBreakingNews(breakingRes.data || []);
      setLatestArticles(latestRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {breakingNews.length > 0 && (
        <div className="bg-slate-900 text-white py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
            <span className="bg-red-600 px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 flex-shrink-0">
              <Zap className="w-3 h-3" />Breaking
            </span>
            <div className="overflow-hidden relative flex-1">
              <div className="animate-marquee whitespace-nowrap">
                {breakingNews.map((article, idx) => (
                  <span key={article.id} className="inline-flex items-center">
                    <Link to={`/article/${article.id}`} className="hover:text-sky-400 transition-colors">{article.title}</Link>
                    {idx < breakingNews.length - 1 && <span className="mx-6 text-slate-500">●</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Stay Informed with <span className="text-sky-400">NewsHub</span></h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of world events.</p>
          </div>
          <div className="max-w-xl mx-auto">
            <Link to="/explore" className="block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <div className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 cursor-pointer hover:bg-white/15 transition-colors flex items-center">
                  <span className="text-slate-400">Search news, topics, or keywords...</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-sky-500" />Featured Stories
              </h2>
              <Link to="/explore" className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles[0] && <div className="md:row-span-2"><ArticleCard article={featuredArticles[0]} variant="featured" /></div>}
              <div className="space-y-4">{featuredArticles.slice(1, 3).map((article) => <ArticleCard key={article.id} article={article} variant="compact" />)}</div>
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Latest News</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.slice(0, 6).map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
          <div className="text-center mt-8">
            <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors">
              View All Articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
