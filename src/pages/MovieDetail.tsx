import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Share2, ChevronLeft, Plus, Check, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieStore } from '@/store/movieStore';
import { useMovieDetails } from '@/hooks/useMovies';
import { getImageUrl, getBackdropUrl } from '@/services/tmdbApi';
import MovieSection from '@/components/MovieSection';
import type { Movie } from '@/types/movie';

// Convert TMDB detail to our Movie format
const convertTMDBDetailToMovie = (tmdbMovie: any): Movie => {
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    titleTh: tmdbMovie.original_title !== tmdbMovie.title ? tmdbMovie.original_title : undefined,
    year: new Date(tmdbMovie.release_date).getFullYear() || 2024,
    rating: parseFloat(tmdbMovie.vote_average.toFixed(1)),
    quality: tmdbMovie.vote_average >= 7 ? '4K' : tmdbMovie.vote_average >= 5 ? 'HD' : 'Zoom',
    audio: 'เสียงไทย',
    poster: getImageUrl(tmdbMovie.poster_path, 'w500'),
    backdrop: getBackdropUrl(tmdbMovie.backdrop_path, 'w1280'),
    genres: tmdbMovie.genres?.map((g: any) => g.name) || [],
    duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : undefined,
    synopsis: tmdbMovie.overview,
    isNew: new Date(tmdbMovie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isSeries: false,
  };
};

// Loading skeleton
const MovieDetailSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a]">
    <div className="relative h-[60vh] lg:h-[70vh]">
      <div className="absolute inset-0 shimmer" />
    </div>
    <div className="relative -mt-32 lg:-mt-48 z-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-64 sm:w-72 lg:w-80 mx-auto lg:mx-0">
            <div className="aspect-[2/3] bg-[#1a1a1a] rounded-xl shimmer" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-[#1a1a1a] rounded w-3/4 shimmer" />
            <div className="h-6 bg-[#1a1a1a] rounded w-1/2 shimmer" />
            <div className="h-4 bg-[#1a1a1a] rounded w-full shimmer" />
            <div className="h-4 bg-[#1a1a1a] rounded w-2/3 shimmer" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite, setCurrentMovie } = useMovieStore();

  // Fetch movie details from API
  const { movie: tmdbMovie, loading, error } = useMovieDetails(id);

  const movie = tmdbMovie ? convertTMDBDetailToMovie(tmdbMovie) : null;
  const isMovieFavorite = movie ? isFavorite(movie.id) : false;

  // Related movies from similar/recommendations
  const relatedMovies = tmdbMovie?.similar?.results?.slice(0, 8).map(convertTMDBDetailToMovie) ||
    tmdbMovie?.recommendations?.results?.slice(0, 8).map(convertTMDBDetailToMovie) || [];

  // Cast information
  const cast = tmdbMovie?.credits?.cast?.slice(0, 6) || [];

  useEffect(() => {
    if (movie) {
      setCurrentMovie(movie);
      document.title = `${movie.title} (${movie.year}) - MovieHub`;
    }
    return () => setCurrentMovie(null);
  }, [movie, setCurrentMovie]);

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-20">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-4">ไม่พบหนังที่ค้นหา</h1>
          <p className="text-gray-400 mb-6">{error || 'กรุณาลองใหม่อีกครั้ง'}</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  const getQualityBadgeClass = (quality: string) => {
    switch (quality) {
      case 'HD':
        return 'bg-green-600';
      case '4K':
        return 'bg-purple-600';
      case 'Zoom':
        return 'bg-blue-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Hero Backdrop */}
      <div className="relative h-[60vh] lg:h-[70vh]">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-32 lg:-mt-48 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative w-64 sm:w-72 lg:w-80 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getQualityBadgeClass(movie.quality)}`}>
                    {movie.quality}
                  </span>
                </div>
                {movie.isNew && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-bold text-white rounded bg-red-600">
                      NEW
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              {movie.titleTh && (
                <h2 className="text-lg sm:text-xl text-gray-400 mb-4">
                  {movie.titleTh}
                </h2>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{movie.year}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{movie.duration}</span>
                  </div>
                )}
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded">
                  {movie.audio}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-sm text-gray-300 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              {movie.synopsis && (
                <p className="text-gray-300 mb-6 max-w-2xl">
                  {movie.synopsis}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <Link to={`/watch/${movie.id}`}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
                    <Play className="w-5 h-5 mr-2 fill-white" />
                    ดูหนังเลย
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleFavoriteToggle}
                  className={`border-white/30 px-6 ${
                    isMovieFavorite
                      ? 'bg-red-600/20 border-red-500 text-red-500'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {isMovieFavorite ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      ในรายการโปรด
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      เพิ่มในรายการโปรด
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('คัดลอกลิงก์แล้ว!');
                  }}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  แชร์
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1">คุณภาพ</p>
                  <p className="text-sm text-white font-semibold">{movie.quality}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">เสียง</p>
                  <p className="text-sm text-white font-semibold">{movie.audio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ปี</p>
                  <p className="text-sm text-white font-semibold">{movie.year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">เรตติ้ง</p>
                  <p className="text-sm text-white font-semibold">{movie.rating}/10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">นักแสดง</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {cast.map((actor: any) => (
              <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 bg-[#1a1a1a]">
                  <img
                    src={getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </div>
                <p className="text-sm text-white font-medium line-clamp-1">{actor.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="mt-8">
          <MovieSection
            title="หนังที่คุณอาจชอบ"
            movies={relatedMovies}
            href="#"
            showViewAll={false}
            size="medium"
          />
        </div>
      )}
    </div>
  );
}
