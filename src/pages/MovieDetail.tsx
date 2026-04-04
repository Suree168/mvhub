import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Share2, ChevronLeft, Plus, Check, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl, getBackdropUrl } from '@/services/tmdbApi';
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '503341fe6d9d6630c68b8a7ec633fbad';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'th-TH',
            append_to_response: 'credits',
          },
        });
        setMovie(res.data);
        setCast((res.data?.credits?.cast || []).slice(0, 6));
        document.title = `${res.data?.title || 'Movie'} - MovieHub`;
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err?.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    );
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

  const title = movie.title || movie.name || 'Unknown';
  const titleTh = movie.original_title !== movie.title ? movie.original_title : '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0';
  const quality = Number(movie.vote_average) >= 7 ? '4K' : Number(movie.vote_average) >= 5 ? 'HD' : 'Zoom';
  const duration = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const genres = (movie.genres || []).map((g: any) => g?.name || '').filter(Boolean);
  const poster = getImageUrl(movie.poster_path, 'w500');
  const backdrop = getBackdropUrl(movie.backdrop_path, 'w1280');

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
        <img src={backdrop} alt={title} className="w-full h-full object-cover" />
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
                <img src={poster} alt={title} className="w-full aspect-[2/3] object-cover" />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded ${quality === '4K' ? 'bg-purple-600' : quality === 'HD' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {quality}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{title}</h1>
              {titleTh && <h2 className="text-lg sm:text-xl text-gray-400 mb-4">{titleTh}</h2>}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">{rating}</span>
                </div>
                {year && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{year}</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{duration}</span>
                  </div>
                )}
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded">เสียงไทย</span>
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 text-sm text-gray-300 bg-white/10 rounded-full">{genre}</span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {movie.overview && <p className="text-gray-300 mb-6 max-w-2xl">{movie.overview}</p>}

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
                  <p className="text-sm text-white font-semibold">{quality}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">เสียง</p>
                  <p className="text-sm text-white font-semibold">เสียงไทย</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ปี</p>
                  <p className="text-sm text-white font-semibold">{year || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">เรตติ้ง</p>
                  <p className="text-sm text-white font-semibold">{rating}/10</p>
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
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {cast.map((actor: any) => (
              <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 bg-[#1a1a1a]">
                  <img
                    src={getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name || ''}
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
    </div>
  );
}
