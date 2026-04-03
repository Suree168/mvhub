import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/types/movie';
import { allMovies } from '@/data/movies';

interface MovieStore {
  // Movies data
  movies: Movie[];
  
  // Favorites
  favorites: string[];
  addToFavorites: (movieId: string) => void;
  removeFromFavorites: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
  getFavoriteMovies: () => Movie[];
  
  // Watch history
  watchHistory: { movieId: string; timestamp: number; progress: number }[];
  addToHistory: (movieId: string, progress: number) => void;
  getWatchProgress: (movieId: string) => number;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Movie[];
  performSearch: (query: string) => void;
  
  // Current movie
  currentMovie: Movie | null;
  setCurrentMovie: (movie: Movie | null) => void;
  
  // Filter by category/genre
  getMoviesByCategory: (category: string) => Movie[];
  getMoviesByGenre: (genre: string) => Movie[];
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      // Initial data
      movies: allMovies,
      
      // Favorites
      favorites: [],
      addToFavorites: (movieId: string) => {
        set((state) => ({
          favorites: [...state.favorites, movieId],
        }));
      },
      removeFromFavorites: (movieId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== movieId),
        }));
      },
      isFavorite: (movieId: string) => {
        return get().favorites.includes(movieId);
      },
      getFavoriteMovies: () => {
        return get().movies.filter((movie) => get().favorites.includes(movie.id));
      },
      
      // Watch history
      watchHistory: [],
      addToHistory: (movieId: string, progress: number) => {
        set((state) => {
          const filtered = state.watchHistory.filter((h) => h.movieId !== movieId);
          return {
            watchHistory: [...filtered, { movieId, timestamp: Date.now(), progress }],
          };
        });
      },
      getWatchProgress: (movieId: string) => {
        const history = get().watchHistory.find((h) => h.movieId === movieId);
        return history?.progress || 0;
      },
      
      // Search
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      searchResults: [],
      performSearch: (query: string) => {
        const lowercaseQuery = query.toLowerCase();
        const results = get().movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(lowercaseQuery) ||
            (movie.titleTh && movie.titleTh.toLowerCase().includes(lowercaseQuery)) ||
            movie.genres.some((g) => g.toLowerCase().includes(lowercaseQuery))
        );
        set({ searchResults: results, searchQuery: query });
      },
      
      // Current movie
      currentMovie: null,
      setCurrentMovie: (movie) => set({ currentMovie: movie }),
      
      // Filter functions
      getMoviesByCategory: (category: string) => {
        const { movies } = get();
        switch (category) {
          case 'new-2026':
            return movies.filter((m) => m.year === 2026);
          case 'new-2025':
            return movies.filter((m) => m.year === 2025);
          case 'new-2024':
            return movies.filter((m) => m.year === 2024);
          case 'netflix':
            return movies.filter((m) => m.isSeries);
          case 'top-imdb':
            return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
          default:
            return movies;
        }
      },
      getMoviesByGenre: (genre: string) => {
        return get().movies.filter((movie) =>
          movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
        );
      },
    }),
    {
      name: 'moviehub-storage',
      partialize: (state) => ({ favorites: state.favorites, watchHistory: state.watchHistory }),
    }
  )
);
