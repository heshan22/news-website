import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Star, AlertTriangle, Newspaper, TrendingUp, X, Check } from 'lucide-react';
import { supabase, type Article, type ArticleInsert } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/ui/Modal';

const categories = [
  { id: 'politics', label: 'Politics' }, { id: 'business', label: 'Business' }, { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' }, { id: 'entertainment', label: 'Entertainment' }, { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' }, { id: 'world', label: 'World' },
];

export function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, totalViews: 0, breaking: 0, featured: 0 });

  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    setLoading(true);
    try {
      const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      setArticles(data || []);
      if (data) {
        setStats({
          total: data.length,
          totalViews: data.reduce((sum, a) => sum + a.views, 0),
          breaking: data.filter((a) => a.is_breaking).length,
          featured: data.filter((a) => a.is_featured).length,
        });
      }
    } catch (e) { console.error(e); showToast('Failed to load articles', 'error'); }
    finally { setLoading(false); }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('Article successfully deleted!', 'success');
      setDeleteConfirmId(null);
    } catch { showToast('Failed to delete article', 'error'); }
  };

  const handleEdit = (article: Article) => { setEditingArticle(article); setIsModalOpen(true); };
  const handleCreate = () => { setEditingArticle(null); setIsModalOpen(true); };

  const handleSave = async (data: ArticleInsert) => {
    try {
      if (editingArticle) {
        const { error } = await supabase.from('articles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editingArticle.id);
        if (error) throw error;
        showToast('Article successfully updated!', 'success');
      } else {
        const { error } = await supabase.from('articles').insert([{ ...data, author: user?.email?.split('@')[0] || 'Admin' }]);
        if (error) throw error;
        showToast('Article successfully created!', 'success');
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch { showToast(editingArticle ? 'Failed to update article' : 'Failed to create article', 'error'); }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your news articles and content</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4"><Newspaper className="w-10 h-10 text-sky-500" /><span className="text-3xl font-bold text-slate-900">{stats.total}</span></div>
            <p className="text-slate-600 font-medium">Total Articles</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4"><TrendingUp className="w-10 h-10 text-emerald-500" /><span className="text-3xl font-bold text-slate-900">{stats.totalViews.toLocaleString()}</span></div>
            <p className="text-slate-600 font-medium">Total Views</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4"><AlertTriangle className="w-10 h-10 text-red-500" /><span className="text-3xl font-bold text-slate-900">{stats.breaking}</span></div>
            <p className="text-slate-600 font-medium">Breaking News</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4"><Star className="w-10 h-10 text-amber-500" /><span className="text-3xl font-bold text-slate-900">{stats.featured}</span></div>
            <p className="text-slate-600 font-medium">Featured Articles</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="flex items-center gap-3">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.label}</option>))}
                </select>
                <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors">
                  <Plus className="w-5 h-5" />Add Article
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Article</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden lg:table-cell">Author</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden sm:table-cell">Views</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden lg:table-cell">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.image_url && <img src={article.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {article.is_breaking && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-medium">Breaking</span>}
                            {article.is_featured && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium">Featured</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell"><span className="capitalize text-slate-600">{article.category}</span></td>
                    <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">{article.author}</td>
                    <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">{article.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">{new Date(article.published_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`/article/${article.id}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4 text-slate-600" /></a>
                        <button onClick={() => handleEdit(article)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4 text-slate-600" /></button>
                        <button onClick={() => setDeleteConfirmId(article.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16"><Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" /><p className="text-slate-500">No articles found</p></div>
          )}
        </div>
      </main>

      <ArticleFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} article={editingArticle} onSave={handleSave} />
      <DeleteConfirmModal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)} />
    </div>
  );
}

function ArticleFormModal({ isOpen, onClose, article, onSave }: { isOpen: boolean; onClose: () => void; article: Article | null; onSave: (data: ArticleInsert) => void; }) {
  const [formData, setFormData] = useState<ArticleInsert>({
    title: '', content: '', excerpt: '', image_url: null, category: 'technology', tags: [], is_featured: false, is_breaking: false, published_at: new Date().toISOString(),
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (article) {
      setFormData({ title: article.title, content: article.content, excerpt: article.excerpt, image_url: article.image_url || null, category: article.category, tags: article.tags, is_featured: article.is_featured, is_breaking: article.is_breaking, published_at: article.published_at });
    } else {
      setFormData({ title: '', content: '', excerpt: '', image_url: null, category: 'technology', tags: [], is_featured: false, is_breaking: false, published_at: new Date().toISOString() });
    }
    setErrors({});
    setTagInput('');
  }, [article, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.image_url?.trim()) newErrors.image_url = 'Image URL is required';
    else if (!/^https?:\/\/.+\..+/.test(formData.image_url)) newErrors.image_url = 'Invalid URL format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!validate()) return; onSave(formData); };
  const addTag = () => { if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) { setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] }); setTagInput(''); } };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={article ? 'Edit Article' : 'Create Article'} size="xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.title ? 'border-red-500' : 'border-slate-300'}`} placeholder="Article title" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Article['category'] })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.label}</option>))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt *</label>
          <input type="text" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.excerpt ? 'border-red-500' : 'border-slate-300'}`} placeholder="Short summary for previews" />
          {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image URL *</label>
          <input type="url" value={formData.image_url || ''} onChange={(e) => setFormData({ ...formData, image_url: e.target.value || null })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.image_url ? 'border-red-500' : 'border-slate-300'}`} placeholder="https://example.com/image.jpg" />
          {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>}
          {formData.image_url && /^https?:\/\/.+\..+/.test(formData.image_url) && <img src={formData.image_url} alt="Preview" className="mt-3 h-24 w-auto rounded-lg object-cover" />}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Content *</label>
          <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none ${errors.content ? 'border-red-500' : 'border-slate-300'}`} placeholder="Full article content..." />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Add a tag" />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
                #{tag}
                <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) })} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
            <span className="text-slate-700 font-medium">Featured Article</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.is_breaking} onChange={(e) => setFormData({ ...formData, is_breaking: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
            <span className="text-slate-700 font-medium">Breaking News</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
            <Check className="w-4 h-4" />{article ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
          <p className="text-slate-700">Are you sure you want to delete this article? This action cannot be undone.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">Delete</button>
        </div>
      </div>
    </Modal>
  );
}
