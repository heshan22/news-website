import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { supabase, type Article } from '../lib/supabase';
import { ArticleCard } from '../components/ui/ArticleCard';

type SortOption = 'newest' | 'oldest' | 'most_viewed';
type CategoryFilter = 'all' | 'politics' | 'business' | 'technology' | 'sports' | 'entertainment' | 'health' | 'science' | 'world';

const categories: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Categories' }, { id: 'politics', label: 'Politics' }, { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' }, { id: 'sports', label: 'Sports' }, { id: 'entertainment', label: 'Entertainment' },
  { id: 'health', label: 'Health' }, { id: 'science', label: 'Science' }, { id: 'world', label: 'World' },
];

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<CategoryFilter>((searchParams.get('category') as CategoryFilter) || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => { fetchArticles(); }, [category, sortBy, searchParams]);

  async function fetchArticles() {
    setLoading(true);
    try {
      let query = supabase.from('articles').select('*');
      if (category !== 'all') query = query.eq('category', category);
      const search = searchParams.get('search');
      if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      if (sortBy === 'newest') query = query.order('published_at', { ascending: false });
      else if (sortBy === 'oldest') query = query.order('published_at', { ascending: true });
      else query = query.order('views', { ascending: false });
      const { data } = await query.limit(50);
      setArticles(data || []);
    } catch (e) { console.error(e); setArticles([]); }
    finally { setLoading(false); }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) searchParams.set('search', searchTerm);
    else searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const clearFilters = () => { setSearchTerm(''); setCategory('all'); setSortBy('newest'); setSearchParams(new URLSearchParams()); };
  const hasActiveFilters = searchTerm || category !== 'all' || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Explore Articles</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </form>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
              <Filter className="w-4 h-4" />Filters {hasActiveFilters && <span className="bg-sky-600 text-xs px-2 rounded-full">Active</span>}
            </button>
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-3`}>
              <div className="relative">
                <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  {categories.find((c) => c.id === category)?.label}<ChevronDown className="w-4 h-4" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-slate-800 rounded-lg shadow-xl py-2 min-w-[180px] z-10">
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => { setCategory(cat.id); setShowCategoryDropdown(false); }}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-700 ${category === cat.id ? 'text-sky-400' : 'text-slate-300'}`}>{cat.label}</button>
                    ))}
                  </div>
                )}
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_viewed">Most Viewed</option>
              </select>
              {hasActiveFilters && <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white transition-colors"><X className="w-4 h-4" />Clear</button>}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">No articles found</h2>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-6">Found <strong>{articles.length}</strong> articles{searchParams.get('search') && <span> for &quot;<strong>{searchParams.get('search')}</strong>&quot;</span>}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
