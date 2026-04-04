import axios from 'axios';

// TMDB API Configuration
// Hardcoded fallback so Vercel deployment works without .env
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '503341fe6d9d6630c68b8a7ec633fbad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'th-TH', // Default language Thai
  },
  timeout: 10000,
});

// Image URL helpers
export const getImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// API Error handler
const handleError = (error: any) => {
  console.error('TMDB API Error:', error);
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.status_message || 'API Error');
  } else if (error.request) {
    // No response received
    throw new Error('Network Error - Please check your connection');
  } else {
    // Something else happened
    throw new Error('An unexpected error occurred');
  }
};

// ==================== MOVIE APIs ====================

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get now playing movies (in theaters)
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get movie details
export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Search movies
export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page = 1) => {
  try {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== TV SERIES APIs ====================

// Get popular TV series
export const getPopularTVSeries = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get TV series details
export const getTVSeriesDetails = async (seriesId: number) => {
  try {
    const response = await tmdbClient.get(`/tv/${seriesId}`, {
      params: {
        append_to_response: 'credits,videos,similar',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Search TV series
export const searchTVSeries = async (query: string, page = 1) => {
  try {
    const response = await tmdbClient.get('/search/tv', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== GENRE APIs ====================

// Get movie genres list
export const getMovieGenres = async () => {
  try {
    const response = await tmdbClient.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    handleError(error);
  }
};

// Get TV genres list
export const getTVGenres = async () => {
  try {
    const response = await tmdbClient.get('/genre/tv/list');
    return response.data.genres;
  } catch (error) {
    handleError(error);
  }
};

// ==================== TRENDING APIs ====================

// Get trending movies/tv
export const getTrending = async (mediaType: 'all' | 'movie' | 'tv' | 'person' = 'all', timeWindow: 'day' | 'week' = 'week') => {
  try {
    const response = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== DISCOVER APIs ====================

// Discover movies with filters
export const discoverMovies = async (params: {
  with_genres?: string;
  primary_release_year?: number;
  vote_average_gte?: number;
  sort_by?: string;
  page?: number;
}) => {
  try {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        ...params,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== UTILS ====================

// Convert TMDB movie to our Movie format
export const convertTMDBMovie = (tmdbMovie: any) => {
  const quality = (tmdbMovie.vote_average >= 7 ? '4K' : tmdbMovie.vote_average >= 5 ? 'HD' : 'Zoom') as '4K' | 'HD' | 'Zoom';
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title || tmdbMovie.name || 'Unknown',
    titleTh: tmdbMovie.original_title !== tmdbMovie.title ? tmdbMovie.original_title : undefined,
    year: tmdbMovie.release_date ? (new Date(tmdbMovie.release_date).getFullYear() || 2024) : 2024,
    rating: tmdbMovie.vote_average ? parseFloat(tmdbMovie.vote_average.toFixed(1)) : 0,
    quality,
    audio: 'เสียงไทย' as const,
    poster: getImageUrl(tmdbMovie.poster_path, 'w500'),
    backdrop: getBackdropUrl(tmdbMovie.backdrop_path, 'w1280'),
    genres: tmdbMovie.genre_ids?.map((id: number) => getGenreNameById(id)) || [],
    duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : undefined,
    synopsis: tmdbMovie.overview || '',
    isNew: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
    isSeries: false,
  };
};

// Genre ID to name mapping (Thai)
const genreMap: Record<number, string> = {
  28: 'แอคชั่น',
  12: 'ผจญภัย',
  16: 'แอนนิเมชั่น',
  35: 'ตลก',
  80: 'อาชญากรรม',
  99: 'สารคดี',
  18: 'ดราม่า',
  10751: 'ครอบครัว',
  14: 'แฟนตาซี',
  36: 'ประวัติศาสตร์',
  27: 'สยองขวัญ',
  10402: 'ดนตรี',
  9648: 'ลึกลับ',
  10749: 'โรแมนติก',
  878: 'วิทยาศาสตร์',
  10770: 'ทีวี',
  53: 'ระทึกขวัญ',
  10752: 'สงคราม',
  37: 'คาวบอย',
};

export const getGenreNameById = (id: number): string => {
  return genreMap[id] || 'อื่นๆ';
};

export const getGenreIdByName = (name: string): number | undefined => {
  const entry = Object.entries(genreMap).find(([, value]) => value === name);
  return entry ? parseInt(entry[0]) : undefined;
};

export default tmdbClient;
