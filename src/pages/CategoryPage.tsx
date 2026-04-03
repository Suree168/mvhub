import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, List, ChevronDown, Film, TrendingUp, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  usePopularMovies,
  useNowPlayingMovies,
  useTopRatedMovies,
  useUpcomingMovies,
  useTrending,
  usePopularTVSeries,
  useMoviesByGenre,
} from '@/hooks/useMovies';
import { getGenreIdByName } from '@/services/tmdbApi';
import MovieCard from '@/components/MovieCard';
import { categories, genres } from '@/data/movies';
import type { Movie } from '@/types/movie';

const sortOptions = [
  { value: 'popularity', label: 'ความนิยม' },
  { value: 'newest', label: 'ใหม่ล่าสุด' },
  { value: 'oldest', label: 'เก่าที่สุด' },
  { value: 'rating-high', label: 'เรตติ้งสูงสุด' },
  { value: 'rating-low', label: 'เรตติ้งต่ำสุด' },
  { value: 'name-asc', label: 'ชื่อ A-Z' },
];

// Category configuration mapping
const categoryConfig: Record<string, { title: string; description: string; useHook: any }> = {
  'new-2026': { title: 'หนังใหม่ 2026', description: 'หนังที่กำลังจะเข้าฉายและหนังใหม่ล่าสุด', useHook: useUpcomingMovies },
  'new-2025': { title: 'หนังใหม่ 2025', description: 'หนังที่เข้าฉายในปี 2025', useHook: useUpcomingMovies },
  'new-2024': { title: 'หนังใหม่ 2024', description: 'หนังที่เข้าฉายในปี 2024', useHook: useUpcomingMovies },
  'theaters': { title: 'หนังชนโรง', description: 'หนังที่กำลังฉายในโรงภาพยนตร์', useHook: useNowPlayingMovies },
  'popular': { title: 'หนังยอดนิยม', description: 'หนังที่ได้รับความนิยมสูงสุด', useHook: usePopularMovies },
  'top-imdb': { title: 'หนังเรตติ้งสูงสุด', description: 'หนังคุณภาพสูงตามคะแนน IMDB', useHook: useTopRatedMovies },
  'trending': { title: 'หนังกำลังฮิต', description: 'หนังที่กำลังได้รับความนิยมในขณะนี้', useHook: () => useTrending('movie', 'week') },
  'netflix': { title: 'ซีรี่ย์ยอดนิยม', description: 'ซีรี่ย์ที่ได้รับความนิยม', useHook: usePopularTVSeries },
  'series': { title: 'ซีรี่ย์ทั้งหมด', description: 'ซีรี่ย์จากทั่วโลก', useHook: usePopularTVSeries },
};

// Loading skeleton
const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="w-full">
        <div className="aspect-[2/3] bg-[#1a1a1a] rounded-xl shimmer" />
        <div className="mt-2 h-4 bg-[#1a1a1a] rounded w-3/4 shimmer" />
        <div className="mt-1 h-3 bg-[#1a1a1a] rounded w-1/2 shimmer" />
      </div>
    ))}
  </div>
);

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const genreParam = searchParams.get('genre');

  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get category/genre info
  const category = categories.find((c) => c.href === `/${slug}`);
  const genre = genres.find((g) => g.href === `/${slug}`);

  // Determine which hook to use
  const config = slug ? categoryConfig[slug] : null;
  const genreId = genreParam ? getGenreIdByName(genreParam) : genre ? getGenreIdByName(genre.name) : undefined;

  // Fetch data based on category
  let movies: Movie[] = [];
  let loading = true;
  let error: string | null = null;

  if (genreId) {
    const result = useMoviesByGenre(genreId, 1);
    movies = result.movies;
    loading = result.loading;
    error = result.error;
  } else if (config) {
    const result = config.useHook(1);
    movies = result.movies || result.series || [];
    loading = result.loading;
    error = result.error;
  } else {
    // Default to popular movies
    const result = usePopularMovies(1);
    movies = result.movies;
    loading = result.loading;
    error = result.error;
  }

  // Sort movies
  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.year - a.year;
      case 'oldest':
        return a.year - b.year;
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Page title
  const pageTitle = config?.title || category?.name || genre?.name || genreParam || 'ทั้งหมด';
  const pageDescription = config?.description || '';

  useEffect(() => {
    document.title = `${pageTitle} - MovieHub`;
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {slug === 'trending' && <TrendingUp className="w-6 h-6 text-red-500" />}
            {slug === 'top-imdb' && <Star className="w-6 h-6 text-yellow-500" />}
            {slug === 'theaters' && <Calendar className="w-6 h-6 text-green-500" />}
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{pageTitle}</h1>
          </div>
          {pageDescription && <p className="text-gray-400">{pageDescription}</p>}
          {!loading && <p className="text-gray-500 text-sm mt-2">พบ {sortedMovies.length} รายการ</p>}
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-[#141414] rounded-xl">
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#1a1a1a] text-white px-4 py-2 pr-10 rounded-lg border border-white/10 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-white/20 ${showFilters ? 'bg-red-600 border-red-600' : 'text-white hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-[#141414] rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <button className="px-4 py-2 text-sm text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                ทั้งหมด
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                HD
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                4K
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                พากย์ไทย
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                ซับไทย
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                จบแล้ว
              </button>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <GridSkeleton />
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
        ) : sortedMovies.length > 0 ? (
          <div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'grid-cols-1'
            }`}
          >
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} size={viewMode === 'grid' ? 'medium' : 'small'} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">ไม่พบหนังในหมวดหมู่นี้</p>
            <p className="text-gray-500 text-sm mt-2">ลองเลือกหมวดหมู่อื่นดู</p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && sortedMovies.length >= 12 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8">
              โหลดเพิ่มเติม
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
