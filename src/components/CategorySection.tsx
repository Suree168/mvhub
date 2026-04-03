import { Link } from 'react-router-dom';
import { Film, Tv, Sparkles, Star, Clapperboard, Heart, Ghost, Sword, Rocket, Music, Brain, Trophy, Swords, Building2 } from 'lucide-react';
import type { Category, Genre } from '@/types/movie';

interface CategorySectionProps {
  categories: Category[];
  genres: Genre[];
}

const getCategoryIcon = (name: string) => {
  if (name.includes('ใหม่')) return Sparkles;
  if (name.includes('ชนโรง')) return Clapperboard;
  if (name.includes('การ์ตูน')) return Star;
  if (name.includes('ซีรี่ย์')) return Tv;
  if (name.includes('NETFLIX')) return Film;
  if (name.includes('IMDB')) return Trophy;
  if (name.includes('Marvel') || name.includes('DC')) return Sword;
  if (name.includes('ซอมบี้')) return Ghost;
  if (name.includes('18+')) return Heart;
  return Film;
};

const getGenreIcon = (nameEn: string) => {
  switch (nameEn.toLowerCase()) {
    case 'action':
      return Swords;
    case 'adventure':
      return Rocket;
    case 'comedy':
      return Sparkles;
    case 'animation':
      return Star;
    case 'crime':
      return Building2;
    case 'drama':
      return Heart;
    case 'fantasy':
      return Sparkles;
    case 'horror':
      return Ghost;
    case 'musical':
      return Music;
    case 'mystery':
      return Brain;
    case 'romance':
      return Heart;
    case 'sci-fi':
      return Rocket;
    case 'sport':
      return Trophy;
    case 'thriller':
      return Ghost;
    case 'war':
      return Swords;
    case 'western':
      return Film;
    default:
      return Film;
  }
};

export default function CategorySection({ categories, genres }: CategorySectionProps) {
  return (
    <section className="py-8 lg:py-12 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="section-title text-xl lg:text-2xl font-bold text-white mb-4">
            หมวดหมู่
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Link
                  key={category.id}
                  to={category.href}
                  className="category-tag flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-gray-300 rounded-lg text-sm hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Genres */}
        <div>
          <h2 className="section-title text-xl lg:text-2xl font-bold text-white mb-4">
            ประเภทหนัง
          </h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const Icon = getGenreIcon(genre.nameEn);
              return (
                <Link
                  key={genre.id}
                  to={genre.href}
                  className="category-tag flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-gray-300 rounded-lg text-sm hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                  {genre.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
