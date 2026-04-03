import { useState, useEffect, useCallback } from 'react';
import {
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMovieDetails,
  searchMovies,
  getMoviesByGenre,
  getTrending,
  discoverMovies,
  convertTMDBMovie,
  getPopularTVSeries,
} from '@/services/tmdbApi';
import type { Movie } from '@/types/movie';

// ==================== USE POPULAR MOVIES ====================
export const usePopularMovies = (page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPopularMovies(page);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
        setTotalPages(data.total_pages);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error, totalPages };
};

// ==================== USE NOW PLAYING MOVIES ====================
export const useNowPlayingMovies = (page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNowPlayingMovies(page);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};

// ==================== USE UPCOMING MOVIES ====================
export const useUpcomingMovies = (page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUpcomingMovies(page);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};

// ==================== USE TOP RATED MOVIES ====================
export const useTopRatedMovies = (page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopRatedMovies(page);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};

// ==================== USE MOVIE DETAILS ====================
export const useMovieDetails = (movieId: string | undefined) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(parseInt(movieId));
        setMovie(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  return { movie, loading, error };
};

// ==================== USE SEARCH MOVIES ====================
export const useSearchMovies = (query: string, page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchMovies(query, page);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
        setTotalResults(data.total_results);
      } catch (err: any) {
        setError(err.message || 'Failed to search movies');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMovies, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query, page]);

  return { movies, loading, error, totalResults };
};

// ==================== USE MOVIES BY GENRE ====================
export const useMoviesByGenre = (genreId: number | undefined, page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genreId) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMoviesByGenre(genreId, page);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genreId, page]);

  return { movies, loading, error };
};

// ==================== USE TRENDING ====================
export const useTrending = (mediaType: 'all' | 'movie' | 'tv' | 'person' = 'movie', timeWindow: 'day' | 'week' = 'week') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrending(mediaType, timeWindow);
        const convertedMovies = data.results
          .filter((item: any) => item.media_type === 'movie' || mediaType !== 'all')
          .map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch trending');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [mediaType, timeWindow]);

  return { movies, loading, error };
};

// ==================== USE DISCOVER MOVIES ====================
export const useDiscoverMovies = (filters: {
  with_genres?: string;
  primary_release_year?: number;
  vote_average_gte?: number;
  sort_by?: string;
  page?: number;
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await discoverMovies(filters);
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err: any) {
        setError(err.message || 'Failed to discover movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters.with_genres, filters.primary_release_year, filters.vote_average_gte, filters.sort_by, filters.page]);

  return { movies, loading, error };
};

// ==================== USE TV SERIES ====================
export const usePopularTVSeries = (page = 1) => {
  const [series, setSeries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPopularTVSeries(page);
        const convertedSeries = data.results.map((item: any) => ({
          ...convertTMDBMovie({ ...item, title: item.name, release_date: item.first_air_date }),
          isSeries: true,
        }));
        setSeries(convertedSeries);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch TV series');
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [page]);

  return { series, loading, error };
};

// ==================== USE INFINITE SCROLL ====================
export const useInfiniteMovies = (fetchFunction: (page: number) => Promise<any>) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const data = await fetchFunction(page);
      const convertedMovies = data.results.map(convertTMDBMovie);
      
      setMovies((prev) => (page === 1 ? convertedMovies : [...prev, ...convertedMovies]));
      setHasMore(page < data.total_pages);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFunction]);

  useEffect(() => {
    loadMore();
  }, []); // Initial load

  return { movies, loading, error, hasMore, loadMore, refresh: () => { setPage(1); setMovies([]); loadMore(); } };
};
