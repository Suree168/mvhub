import { useNavigate } from 'react-router-dom';
import { Play, Info, Star, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/types/movie';

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative h-[70vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 hero-gradient" />
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
            {movie.isSeries && (
              <span className="px-3 py-1 bg-purple-600 text-white text-sm font-bold rounded">
                ซีรีส์
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
                <Clock className="w-4 h-4" />
                <span>{movie.duration}</span>
              </div>
            )}
            <span className="px-2 py-0.5 bg-red-600/20 text-red-400 rounded text-xs">
              {movie.audio}
            </span>
          </div>

          {/* Genres */}
          {movie.genres && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-sm text-gray-300 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
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
            <Button
              size="lg"
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 lg:px-8"
            >
              <Play className="w-5 h-5 mr-2 fill-white" />
              ดูหนังเลย
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="border-white/30 text-white hover:bg-white/10 px-6 lg:px-8"
            >
              <Info className="w-5 h-5 mr-2" />
              รายละเอียด
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
