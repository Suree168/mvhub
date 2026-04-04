import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Server, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieDetails } from '@/hooks/useMovies';
import { getImageUrl, getBackdropUrl, convertTMDBMovie } from '@/services/tmdbApi';
import MovieSection from '@/components/MovieSection';
import type { Movie } from '@/types/movie';

// Embed sources that support TMDB movie IDs
const EMBED_SOURCES = [
  { id: 'vidlink', name: 'Server 1', getUrl: (id: string, lang: string) => `https://vidlink.pro/movie/${id}?primaryColor=E50914&autoplay=false${lang === 'th' ? '&sub=th' : ''}` },
  { id: 'moviesapi', name: 'Server 2', getUrl: (id: string, lang: string) => `https://moviesapi.club/movie/${id}` },
  { id: 'multiembed', name: 'Server 3', getUrl: (id: string, lang: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  { id: 'vidsrc_cc', name: 'Server 4', getUrl: (id: string, lang: string) => `https://vidsrc.cc/v2/embed/movie/${id}` },
];

// Convert TMDB detail format to Movie
const convertTMDBDetailToMovie = (tmdbMovie: any): Movie | null => {
  try {
    if (!tmdbMovie || !tmdbMovie.id) return null;
    return {
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title || tmdbMovie.name || 'Unknown',
      titleTh: tmdbMovie.original_title !== tmdbMovie.title ? tmdbMovie.original_title : undefined,
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 2024,
      rating: tmdbMovie.vote_average ? parseFloat(tmdbMovie.vote_average.toFixed(1)) : 0,
      quality: tmdbMovie.vote_average >= 7 ? '4K' : tmdbMovie.vote_average >= 5 ? 'HD' : 'Zoom',
      audio: 'เสียงไทย',
      poster: getImageUrl(tmdbMovie.poster_path, 'w500'),
      backdrop: getBackdropUrl(tmdbMovie.backdrop_path, 'w1280'),
      genres: tmdbMovie.genres?.map((g: any) => g.name) || [],
      duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : undefined,
      synopsis: tmdbMovie.overview || '',
      isNew: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
      isSeries: false,
    };
  } catch (e) {
    console.error('Error converting movie:', e);
    return null;
  }
};

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch movie details from TMDB API
  const { movie: tmdbMovie, loading, error: fetchError } = useMovieDetails(id);
  const movie = tmdbMovie ? convertTMDBDetailToMovie(tmdbMovie) : null;

  // Selected embed source
  const [selectedSource, setSelectedSource] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [audioPref, setAudioPref] = useState('th'); // 'th' or 'en'

  // Related movies
  const relatedMovies: Movie[] = [];
  try {
    const similarResults = tmdbMovie?.similar?.results || [];
    const recommendationResults = tmdbMovie?.recommendations?.results || [];
    const rawRelated = similarResults.length > 0 ? similarResults : recommendationResults;
    rawRelated.slice(0, 6).forEach((item: any) => {
      try {
        if (item && item.id) {
          relatedMovies.push(convertTMDBMovie(item));
        }
      } catch (e) {
        // Skip
      }
    });
  } catch (e) {
    console.error('Error converting related movies:', e);
  }

  useEffect(() => {
    if (movie) {
      document.title = `กำลังเล่น: ${movie.title} - MovieHub`;
    }
  }, [movie]);

  // Reset error when changing source
  useEffect(() => {
    setIframeError(false);
  }, [selectedSource]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">กำลังโหลดข้อมูลหนัง...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !movie || !id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">ไม่พบหนังที่ค้นหา</h1>
          <p className="text-gray-400 mb-4">{fetchError || 'กรุณาลองใหม่อีกครั้ง'}</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    );
  }

  const currentSource = EMBED_SOURCES[selectedSource];
  const embedUrl = currentSource.getUrl(id, audioPref);

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-white font-semibold text-sm sm:text-base line-clamp-1">{movie.title}</h2>
            {movie.titleTh && <p className="text-gray-400 text-xs line-clamp-1">{movie.titleTh}</p>}
          </div>
        </div>

        {/* Control Options (Language & Server) */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          {/* Audio Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">เสียง:</span>
            <div className="flex bg-[#141414] rounded-lg p-0.5">
              <button
                onClick={() => setAudioPref('th')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  audioPref === 'th' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                พากย์ไทย/ซับไทย
              </button>
              <button
                onClick={() => setAudioPref('en')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  audioPref === 'en' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Soundtrack (EN)
              </button>
            </div>
          </div>

          {/* Server Selection */}
          <div className="flex items-center justify-end gap-2">
            <Server className="w-4 h-4 text-gray-400 hidden sm:block" />
            {EMBED_SOURCES.map((source, index) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(index)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-lg transition-all border border-transparent ${
                  selectedSource === index
                    ? 'bg-red-600/20 text-red-500 border-red-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player - Embed iframe */}
      <div className="relative w-full bg-black" style={{ height: 'calc(100vh - 120px)', maxHeight: '80vh' }}>
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center p-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">เซิร์ฟเวอร์นี้ไม่สามารถเล่นได้</p>
              <p className="text-gray-400 text-sm mb-4">กรุณาเลือกเซิร์ฟเวอร์อื่น</p>
              <div className="flex gap-2 justify-center">
                {EMBED_SOURCES.map((source, index) => (
                  index !== selectedSource && (
                    <button
                      key={source.id}
                      onClick={() => setSelectedSource(index)}
                      className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      {source.name}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
        <iframe
          key={`${id}-${selectedSource}`}
          src={embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="origin"
          title={movie.title}
          onError={() => setIframeError(true)}
        />
      </div>

      {/* Movie Info Below Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.titleTh && <p className="text-gray-400 mb-4">{movie.titleTh}</p>}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">
                {movie.quality}
              </span>
              <span className="text-gray-400">{movie.year}</span>
              {movie.duration && <span className="text-gray-400">{movie.duration}</span>}
              <span className="px-2 py-1 text-xs text-white bg-red-600 rounded">
                {movie.audio}
              </span>
            </div>

            <p className="text-gray-300 mb-6">{movie.synopsis}</p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-sm text-gray-300 bg-white/10 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Tip */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                💡 <strong>เคล็ดลับ:</strong> หากเซิร์ฟเวอร์ปัจจุบันไม่โหลด ให้ลองเปลี่ยนเซิร์ฟเวอร์ด้านบน
              </p>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="lg:w-80">
            <div className="bg-[#141414] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <h3 className="text-white font-semibold">ความคิดเห็น</h3>
              </div>
              <p className="text-gray-500 text-sm text-center py-8">
                ระบบความคิดเห็นจะเปิดใช้งานเร็วๆ นี้
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <MovieSection
          title="ดูต่อ"
          movies={relatedMovies}
          href="#"
          showViewAll={false}
          size="medium"
        />
      )}
    </div>
  );
}
