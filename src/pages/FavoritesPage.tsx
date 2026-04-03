import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Play, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieStore } from '@/store/movieStore';
import MovieCard from '@/components/MovieCard';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { getFavoriteMovies, removeFromFavorites, favorites } = useMovieStore();
  const favoriteMovies = getFavoriteMovies();

  useEffect(() => {
    document.title = 'รายการโปรด - MovieHub';
  }, []);

  const handleClearAll = () => {
    if (confirm('คุณต้องการลบหนังทั้งหมดออกจากรายการโปรดใช่หรือไม่?')) {
      favorites.forEach((id) => removeFromFavorites(id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              รายการโปรด
            </h1>
            <p className="text-gray-400 mt-2">
              หนังที่คุณบันทึกไว้ดูภายหลัง
            </p>
          </div>
          
          {favoriteMovies.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ลบทั้งหมด
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        {favoriteMovies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#141414] rounded-xl p-4">
              <p className="text-gray-400 text-sm">จำนวนหนัง</p>
              <p className="text-2xl font-bold text-white">{favoriteMovies.length}</p>
            </div>
            <div className="bg-[#141414] rounded-xl p-4">
              <p className="text-gray-400 text-sm">หนังใหม่ 2026</p>
              <p className="text-2xl font-bold text-white">
                {favoriteMovies.filter((m) => m.year === 2026).length}
              </p>
            </div>
            <div className="bg-[#141414] rounded-xl p-4">
              <p className="text-gray-400 text-sm">ซีรี่ย์</p>
              <p className="text-2xl font-bold text-white">
                {favoriteMovies.filter((m) => m.isSeries).length}
              </p>
            </div>
            <div className="bg-[#141414] rounded-xl p-4">
              <p className="text-gray-400 text-sm">เรตติ้งเฉลี่ย</p>
              <p className="text-2xl font-bold text-white">
                {(favoriteMovies.reduce((acc, m) => acc + m.rating, 0) / favoriteMovies.length).toFixed(1)}
              </p>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {favoriteMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteMovies.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} size="medium" />
                {/* Remove Button */}
                <button
                  onClick={() => removeFromFavorites(movie.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              ยังไม่มีหนังในรายการโปรด
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              เพิ่มหนังที่คุณชอบเข้ารายการโปรด เพื่อดูภายหลังได้ง่ายๆ
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Film className="w-5 h-5 mr-2" />
              ไปดูหนัง
            </Button>
          </div>
        )}

        {/* Continue Watching CTA */}
        {favoriteMovies.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-xl border border-red-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  พร้อมดูหนังแล้ว?
                </h3>
                <p className="text-gray-400 text-sm">
                  เลือกหนังจากรายการโปรดและเริ่มรับชมได้เลย
                </p>
              </div>
              <Button
                onClick={() => navigate(`/movie/${favoriteMovies[0].id}`)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Play className="w-5 h-5 mr-2 fill-white" />
                ดูหนังแรกในรายการ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
