import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import MovieCard from './MovieCard';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/types/movie';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  showViewAll?: boolean;
  href?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function MovieSection({
  title,
  movies,
  showViewAll = true,
  href = '#',
  size = 'medium',
}: MovieSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="section-title text-xl lg:text-2xl font-bold text-white">
            {title}
          </h2>
          {showViewAll && href !== '#' && (
            <Link
              to={href}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Movie Slider */}
        <div className="relative group">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-black/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Movies Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} size={size} />
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-black/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
