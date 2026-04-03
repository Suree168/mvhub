import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMovieStore } from '@/store/movieStore';
import { useMovieDetails } from '@/hooks/useMovies';
import { getImageUrl, getBackdropUrl, convertTMDBMovie } from '@/services/tmdbApi';
import MovieSection from '@/components/MovieSection';
import type { Movie } from '@/types/movie';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addToHistory, getWatchProgress } = useMovieStore();

  // Fetch movie details from TMDB API
  const { movie: tmdbMovie, loading, error: fetchError } = useMovieDetails(id);
  const movie = tmdbMovie ? convertTMDBDetailToMovie(tmdbMovie) : null;

  // Related movies from similar results
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
        // Skip items that fail to convert
      }
    });
  } catch (e) {
    console.error('Error converting related movies:', e);
  }

  // Embed video URL - try to find a YouTube trailer from TMDB videos
  const trailerKey = tmdbMovie?.videos?.results?.find(
    (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )?.key;

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedAudio, setSelectedAudio] = useState('thai');
  const [showSettings, setShowSettings] = useState(false);
  const [useEmbedPlayer, setUseEmbedPlayer] = useState(true);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (movie) {
      document.title = `กำลังเล่น: ${movie.title} - MovieHub`;
      // If there's a trailer, default to embed; otherwise use HTML5 player
      setUseEmbedPlayer(!!trailerKey);
    }
  }, [movie, trailerKey]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Video controls (for HTML5 player fallback)
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0];
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('video-container');
    if (container) {
      if (!isFullscreen) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Format time
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  if (fetchError || !movie) {
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

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Container */}
      <div
        id="video-container"
        className="relative w-full aspect-video bg-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* YouTube Embed Player (default when trailer is available) */}
        {useEmbedPlayer && trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&hl=th`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={movie.title}
          />
        ) : (
          <>
            {/* HTML5 Video Player (fallback) */}
            <video
              ref={videoRef}
              className="w-full h-full"
              poster={movie.backdrop || movie.poster}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              onEnded={() => setIsPlaying(false)}
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Overlay (when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Controls Overlay */}
            <div
              className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <div>
                    <h2 className="text-white font-semibold">{movie.title}</h2>
                    {movie.titleTh && <p className="text-gray-400 text-sm">{movie.titleTh}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="absolute top-16 right-4 bg-black/90 rounded-lg p-4 min-w-[200px] z-50">
                  <div className="mb-4">
                    <p className="text-white text-sm font-semibold mb-2">คุณภาพ</p>
                    {['4K', '1080p', '720p', '480p', '360p'].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedQuality === quality
                            ? 'bg-red-600 text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold mb-2">เสียง</p>
                    {[
                      { id: 'thai', label: 'พากย์ไทย' },
                      { id: 'sub', label: 'ซับไทย' },
                      { id: 'en', label: 'อังกฤษ' },
                    ].map((audio) => (
                      <button
                        key={audio.id}
                        onClick={() => setSelectedAudio(audio.id)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedAudio === audio.id
                            ? 'bg-red-600 text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {audio.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                    </Button>

                    {/* Skip Buttons */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-10)}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(10)}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 group">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <div className="w-0 overflow-hidden group-hover:w-24 transition-all">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>
                    </div>

                    {/* Time Display */}
                    <span className="text-white text-sm ml-2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quality Badge */}
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded">
                      {selectedQuality}
                    </span>

                    {/* Fullscreen */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Top Bar for Embed Player */}
        {useEmbedPlayer && trailerKey && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div>
                <h2 className="text-white font-semibold">{movie.title}</h2>
                {movie.titleTh && <p className="text-gray-400 text-sm">{movie.titleTh}</p>}
              </div>
            </div>
          </div>
        )}
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
