import { Link } from 'react-router-dom';
import { Newspaper, Twitter, Facebook, Youtube } from 'lucide-react';

const categories = [
  { id: 'politics', label: 'Politics' }, { id: 'business', label: 'Business' }, { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' }, { id: 'entertainment', label: 'Entertainment' }, { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' }, { id: 'world', label: 'World' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Newspaper className="w-8 h-8 text-sky-400" />
              <span className="font-bold text-xl">NewsHub</span>
            </Link>
            <p className="text-slate-400 text-sm mb-4">Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of world events.</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}><Link to={`/explore?category=${cat.id}`} className="text-slate-400 hover:text-sky-400 transition-colors text-sm">{cat.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">More</h4>
            <ul className="space-y-2">
              {categories.slice(4).map((cat) => (
                <li key={cat.id}><Link to={`/explore?category=${cat.id}`} className="text-slate-400 hover:text-sky-400 transition-colors text-sm">{cat.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NewsHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
