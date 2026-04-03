import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, Film, Star, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchMovies } from '@/hooks/useMovies';
import type { Movie } from '@/types/movie';

const popularSearches = [
  'Avengers',
  'Spider-Man',
  'Batman',
  'หนังไทย',
  'Netflix',
  'Marvel',
  'หนังใหม่',
  'หนังสยองขวัญ',
];

// Search result card
const SearchResultCard = ({ movie }: { movie: Movie }) => (
  <Link
    to={`/movie/${movie.id}`}
    className="group flex gap-4 p-4 bg-[#141414] rounded-xl hover:bg-[#1a1a1a] transition-colors"
  >
    {/* Poster */}
    <div className="w-24 sm:w-32 flex-shrink-0">
      <div className="aspect-[2/3] rounded-lg overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-1">
        {movie.title}
      </h3>
      {movie.titleTh && (
        <p className="text-sm text-gray-400 line-clamp-1">{movie.titleTh}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-2">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white">{movie.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{movie.year}</span>
        </div>
        <span className="px-2 py-0.5 text-xs font-bold text-white bg-green-600 rounded">
          {movie.quality}
        </span>
      </div>

      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="px-2 py-0.5 text-xs text-gray-400 bg-white/5 rounded">
              {genre}
            </span>
          ))}
        </div>
      )}

      {movie.synopsis && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{movie.synopsis}</p>
      )}
    </div>
  </Link>
);

// Loading skeleton
const SearchSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-[#141414] rounded-xl">
        <div className="w-24 sm:w-32 flex-shrink-0">
          <div className="aspect-[2/3] bg-[#1a1a1a] rounded-lg shimmer" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-[#1a1a1a] rounded w-1/2 shimmer" />
          <div className="h-4 bg-[#1a1a1a] rounded w-1/3 shimmer" />
          <div className="h-4 bg-[#1a1a1a] rounded w-3/4 shimmer" />
        </div>
      </div>
    ))}
  </div>
);

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Search movies using API
  const { movies: searchResults, loading, error, totalResults } = useSearchMovies(queryParam, 1);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Update page title
  useEffect(() => {
    if (queryParam) {
      document.title = `ค้นหา: ${queryParam} - MovieHub`;
    } else {
      document.title = 'ค้นหา - MovieHub';
    }
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });

      // Save to recent searches
      const updated = [searchQuery.trim(), ...recentSearches.filter((s) => s !== searchQuery.trim())].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setSearchParams({ q: term });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">ค้นหาหนัง</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="พิมพ์ชื่อหนัง หรือประเภทหนัง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[#141414] border-white/10 text-white text-lg rounded-xl focus:border-red-500 focus:ring-red-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {queryParam ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                ผลการค้นหา &quot;{queryParam}&quot;
              </h2>
              {!loading && (
                <span className="text-gray-400">
                  พบ {totalResults} รายการ
                </span>
              )}
            </div>

            {loading ? (
              <SearchSkeleton />
            ) : error ? (
              <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6 text-center">
                <p className="text-red-400">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4 border-red-600/50 text-red-400"
                  onClick={() => window.location.reload()}
                >
                  ลองใหม่
                </Button>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((movie) => (
                  <SearchResultCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">ไม่พบหนังที่ค้นหา</p>
                <p className="text-gray-500 text-sm mt-2">
                  ลองค้นหาด้วยคำอื่น หรือตรวจสอบการสะกด
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    การค้นหาล่าสุด
                  </h2>
                  <button
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recentSearches');
                    }}
                    className="text-sm text-gray-400 hover:text-red-500"
                  >
                    ล้างทั้งหมด
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <div
                      key={search}
                      className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-gray-300 rounded-full group hover:bg-[#1a1a1a]"
                    >
                      <button
                        onClick={() => handlePopularSearch(search)}
                        className="hover:text-white"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                คำค้นหายอดนิยม
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearch(term)}
                    className="px-4 py-2 bg-[#141414] text-gray-300 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse All */}
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">หรือเลือกดูหนังทั้งหมด</p>
              <Link to="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Film className="w-5 h-5 mr-2" />
                  ดูหนังทั้งหมด
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
