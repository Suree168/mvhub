import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Server, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/services/tmdbApi';
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '503341fe6d9d6630c68b8a7ec633fbad';

// Embed sources
const EMBED_SOURCES = [
  { id: 'vidlink', name: 'Server 1', getUrl: (tmdbId: string) => `https://vidlink.pro/movie/${tmdbId}?primaryColor=E50914&autoplay=false` },
  { id: 'moviesapi', name: 'Server 2', getUrl: (tmdbId: string) => `https://moviesapi.club/movie/${tmdbId}` },
  { id: 'multiembed', name: 'Server 3', getUrl: (tmdbId: string) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1` },
  { id: 'vidsrc_cc', name: 'Server 4', getUrl: (tmdbId: string) => `https://vidsrc.cc/v2/embed/movie/${tmdbId}` },
];

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: { api_key: TMDB_API_KEY, language: 'th-TH' },
        });
        setMovie(res.data);
        document.title = `กำลังเล่น: ${res.data?.title || 'Movie'} - MovieHub`;
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !movie || !id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-4">ไม่สามารถโหลดหนังได้</h1>
          <p className="text-gray-400 mb-6">{error || 'ไม่พบข้อมูลหนัง'}</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">กลับหน้าแรก</Button>
        </div>
      </div>
    );
  }

  const embedUrl = EMBED_SOURCES[selectedServer].getUrl(id);
  const title = movie.title || movie.name || 'Unknown';
  const poster = getImageUrl(movie.poster_path, 'w342');

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="flex items-center gap-4 p-4 bg-black/90 border-b border-white/10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold truncate">{title}</h1>
          <p className="text-xs text-gray-400">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : ''} • {movie.runtime ? `${movie.runtime} นาที` : ''}
          </p>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          key={embedUrl}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="origin"
          style={{ border: 'none' }}
        />
      </div>

      {/* Server Selection */}
      <div className="p-4 bg-[#0a0a0a]">
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-semibold">เลือกเซิร์ฟเวอร์:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMBED_SOURCES.map((source, index) => (
            <button
              key={source.id}
              onClick={() => setSelectedServer(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedServer === index
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">💡 หากเซิร์ฟเวอร์ไม่ทำงาน ลองเปลี่ยนเซิร์ฟเวอร์อื่น</p>
      </div>

      {/* Movie Info */}
      <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="flex gap-4">
          <img src={poster} alt={title} className="w-20 h-28 rounded-lg object-cover flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {movie.overview && <p className="text-sm text-gray-400 mt-1 line-clamp-3">{movie.overview}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
