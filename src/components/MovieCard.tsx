import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

export default function MovieCard({ movie, size = 'medium' }: MovieCardProps) {
  const sizeClasses = {
    small: 'w-36 sm:w-40',
    medium: 'w-40 sm:w-48 lg:w-52',
    large: 'w-48 sm:w-56 lg:w-64',
  };

  const getQualityBadgeClass = (quality: string) => {
    switch (quality) {
      case 'HD':
        return 'quality-badge';
      case '4K':
        return 'bg-gradient-to-r from-purple-500 to-purple-700';
      case 'Zoom':
        return 'zoom-badge';
      default:
        return 'quality-badge';
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`movie-card group relative rounded-xl overflow-hidden bg-[#141414] ${sizeClasses[size]} flex-shrink-0 block`}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 movie-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Quality Badge */}
          <span className={`px-2 py-0.5 text-xs font-bold text-white rounded ${getQualityBadgeClass(movie.quality)}`}>
            {movie.quality}
          </span>

          {/* New Badge */}
          {movie.isNew && (
            <span className="px-2 py-0.5 text-xs font-bold text-white rounded bg-gradient-to-r from-red-500 to-red-700">
              NEW
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/70 rounded-full">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">{movie.rating}</span>
        </div>

        {/* Audio Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="thai-badge px-2 py-0.5 text-xs font-bold text-white rounded">
            {movie.audio}
          </span>
        </div>

        {/* Year Badge */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 text-xs font-bold text-white rounded bg-black/70">
            {movie.year}
          </span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        {movie.titleTh && (
          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{movie.titleTh}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          {movie.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {movie.duration}
            </span>
          )}
          {movie.isSeries && (
            <span className="px-1.5 py-0.5 bg-red-600/20 text-red-400 rounded text-[10px]">
              ซีรีส์
            </span>
          )}
        </div>
        {movie.genres && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-1.5 py-0.5 text-[10px] text-gray-400 bg-white/5 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
