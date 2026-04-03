import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Tv, Home, Star, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMovieStore } from '@/store/movieStore';

const navItems = [
  { name: 'หน้าแรก', href: '/', icon: Home },
  { name: 'หนังใหม่ 2026', href: '/category/new-2026', icon: Film },
  { name: 'หนังชนโรง', href: '/category/theaters', icon: Star },
  { name: 'หนังการ์ตูน', href: '/category/animation', icon: Film },
  { name: 'หนังไทย', href: '/category/thai', icon: Film },
  { name: 'ดูซีรี่ย์', href: '/category/series', icon: Tv },
  { name: 'NETFLIX', href: '/category/netflix', icon: Film },
  { name: 'TOP IMDB', href: '/category/top-imdb', icon: TrendingUp },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { performSearch } = useMovieStore();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 nav-blur border-b border-white/10' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white">MovieHub</span>
              <span className="text-xs text-red-500 block -mt-1">ดูหนังออนไลน์</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  isActive(item.href)
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ค้นหาหนัง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400 search-input focus:w-72 lg:focus:w-80 transition-all"
              />
            </form>

            {/* Favorites Button */}
            <Link to="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-white/10 ${
                  location.pathname === '/favorites' ? 'text-red-500' : 'text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${location.pathname === '/favorites' ? 'fill-red-500' : ''}`} />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/95 nav-blur border-t border-white/10">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ค้นหาหนัง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'text-white bg-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Favorites */}
              <Link
                to="/favorites"
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === '/favorites'
                    ? 'text-white bg-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                รายการโปรด
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
