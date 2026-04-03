import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, TrendingUp, Film, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePopularMovies, useNowPlayingMovies, useTopRatedMovies, useTrending, usePopularTVSeries } from '@/hooks/useMovies';
import MovieSection from '@/components/MovieSection';
import CategorySection from '@/components/CategorySection';
import WelcomeSection from '@/components/WelcomeSection';
import { categories, genres } from '@/data/movies';
import type { Movie } from '@/types/movie';

// Loading skeleton component
const HeroSkeleton = () => (
  <div className="relative h-[70vh] lg:h-[85vh] w-full bg-[#141414]">
    <div className="absolute inset-0 shimmer" />
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
  </div>
);

// Hero section with real API data
const HeroSection = ({ movie }: { movie: Movie | null }) => {
  if (!movie) return <HeroSkeleton />;

  return (
    <section className="relative h-[70vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16 lg:pb-24">
        <div className="max-w-2xl">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded">
              {movie.quality}
            </span>
            {movie.isNew && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded">
                หนังใหม่
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2">
            {movie.title}
          </h1>
          {movie.titleTh && (
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4">
              {movie.titleTh}
            </h2>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{movie.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.year}</span>
            </div>
            {movie.duration && (
              <div className="flex items-center gap-1">
                <Film className="w-4 h-4" />
                <span>{movie.duration}</span>
              </div>
            )}
            <span className="px-2 py-0.5 bg-red-600/20 text-red-400 rounded text-xs">
              {movie.audio}
            </span>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-sm text-gray-300 bg-white/10 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {movie.synopsis && (
            <p className="text-gray-300 text-sm lg:text-base mb-6 line-clamp-3">
              {movie.synopsis}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link to={`/movie/${movie.id}`}>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-6 lg:px-8">
                <Play className="w-5 h-5 mr-2 fill-white" />
                ดูหนังเลย
              </Button>
            </Link>
            <Link to={`/movie/${movie.id}`}>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 lg:px-8">
                รายละเอียด
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
};

// Movie section with loading state
const MovieSectionWithLoading = ({
  title,
  movies,
  loading,
  error,
  href,
}: {
  title: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
  href: string;
}) => {
  if (loading) {
    return (
      <section className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white">{title}</h2>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-40 sm:w-48 lg:w-52 flex-shrink-0">
                <div className="aspect-[2/3] bg-[#1a1a1a] rounded-xl shimmer" />
                <div className="mt-2 h-4 bg-[#1a1a1a] rounded w-3/4 shimmer" />
                <div className="mt-1 h-3 bg-[#1a1a1a] rounded w-1/2 shimmer" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">{title}</h2>
          <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Button variant="outline" className="mt-4 border-red-600/50 text-red-400" onClick={() => window.location.reload()}>
              ลองใหม่
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return <MovieSection title={title} movies={movies} href={href} size="medium" />;
};

export default function Home() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  // Fetch data from TMDB API
  const { movies: popularMovies, loading: popularLoading, error: popularError } = usePopularMovies(1);
  const { movies: nowPlayingMovies, loading: nowPlayingLoading, error: nowPlayingError } = useNowPlayingMovies(1);
  const { movies: topRatedMovies, loading: topRatedLoading, error: topRatedError } = useTopRatedMovies(1);
  const { movies: trendingMovies, loading: trendingLoading, error: trendingError } = useTrending('movie', 'week');
  const { series: tvSeries, loading: tvLoading, error: tvError } = usePopularTVSeries(1);

  // Set hero movie from trending
  useEffect(() => {
    if (trendingMovies.length > 0 && !heroMovie) {
      setHeroMovie(trendingMovies[0]);
    }
  }, [trendingMovies, heroMovie]);

  // Update page title
  useEffect(() => {
    document.title = 'MovieHub - ดูหนังออนไลน์ฟรี ดูหนังใหม่ HD และ 4K';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <HeroSection movie={heroMovie} />

      {/* Welcome Section */}
      <WelcomeSection />

      {/* Trending Movies */}
      <MovieSectionWithLoading
        title="หนังกำลังฮิต"
        movies={trendingMovies}
        loading={trendingLoading}
        error={trendingError}
        href="/category/trending"
      />

      {/* Now Playing Movies */}
      <MovieSectionWithLoading
        title="หนังกำลังฉายในโรง"
        movies={nowPlayingMovies}
        loading={nowPlayingLoading}
        error={nowPlayingError}
        href="/category/theaters"
      />

      {/* Popular Movies */}
      <MovieSectionWithLoading
        title="หนังยอดนิยม"
        movies={popularMovies}
        loading={popularLoading}
        error={popularError}
        href="/category/popular"
      />

      {/* Categories & Genres */}
      <CategorySection categories={categories} genres={genres} />

      {/* Top Rated Movies */}
      <MovieSectionWithLoading
        title="หนังเรตติ้งสูงสุด"
        movies={topRatedMovies}
        loading={topRatedLoading}
        error={topRatedError}
        href="/category/top-imdb"
      />

      {/* TV Series */}
      <MovieSectionWithLoading
        title="ซีรี่ย์ยอดนิยม"
        movies={tvSeries}
        loading={tvLoading}
        error={tvError}
        href="/category/series"
      />

      {/* API Status Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">ข้อมูลจาก TMDB API</h3>
                <p className="text-gray-400 text-sm">ข้อมูลหนังอัพเดทแบบ Real-time จาก The Movie Database</p>
              </div>
            </div>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              เรียนรู้เพิ่มเติม
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
