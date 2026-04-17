import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Search as SearchIcon, 
  Volume2, VolumeX, Music, Loader2, ListMusic, Maximize2, 
  Minimize2, ChevronLeft, Disc, Heart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumb: string;
  duration?: number;
}

const MusicPlayer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/music/search?s=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = async (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    
    if (audioRef.current) {
      // Play securely via the local proxy to handle monochrome.tf CORS/redirects
      audioRef.current.src = `/api/music/stream?id=${track.id}`;
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  };

  return (
    <div className="relative w-full h-[85vh] max-h-[900px] overflow-hidden rounded-[40px] border border-white/10 flex flex-col bg-[#0D0D0D]/70 backdrop-blur-[40px] shadow-2xl">
      {/* Immersive Background Blur */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 70%)`,
              filter: 'blur(100px) brightness(0.4) saturate(1.5)',
              transform: 'scale(1.2)'
            }}
          />
        )}
      </AnimatePresence>

      <div className="h-full flex flex-col md:flex-row overflow-hidden">
        {/* Search Section */}
        <div className="w-full md:w-[380px] h-full flex flex-col p-8 border-r border-white/5 bg-black/20">
          <div className="relative mb-6">
            <input 
              type="text"
              placeholder="Search tracks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/20 font-black uppercase tracking-widest text-xs gap-4">
                <Loader2 className="animate-spin" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group border border-transparent ${
                    currentTrack?.id === track.id ? 'bg-white/10 border-white/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5 relative">
                    <img src={track.thumb} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex gap-1 items-end h-3">
                          <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-white" />
                          <motion.div animate={{ height: [8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-white" />
                          <motion.div animate={{ height: [12, 6, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                    <p className="text-xs text-white/40 truncate">{track.artist}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/10 font-black uppercase tracking-widest text-[10px] text-center px-4 leading-relaxed">
                <Music className="mb-4 opacity-20" size={40} />
                No tracks found.<br/>Search for your favorite artist.
              </div>
            )}
          </div>
        </div>

        {/* Now Playing Section */}
        <div className="flex-1 h-full flex flex-col items-center justify-center p-12 relative overflow-hidden">
          {currentTrack ? (
            <>
              <motion.div 
                key={currentTrack.id}
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-64 h-64 md:w-80 md:h-80 rounded-[48px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] mb-12 relative z-10 border border-white/5"
              >
                <img 
                  src={currentTrack.thumb.includes('lh3.googleusercontent.com') || currentTrack.thumb.includes('ytimg.com')
                    ? currentTrack.thumb.replace('w60-h60', 'w1080-h1080') 
                    : currentTrack.thumb} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </motion.div>

              <div className="text-center mb-12 relative z-10 w-full max-w-2xl">
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={`title-${currentTrack.id}`}
                  className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-3 drop-shadow-2xl truncate"
                >
                  {currentTrack.title}
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  key={`artist-${currentTrack.id}`}
                  className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white/40"
                >
                  {currentTrack.artist}
                </motion.p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xl px-4 mb-12 relative z-10">
                <div 
                  className="h-2 bg-white/5 rounded-full relative cursor-pointer group"
                  onClick={handleProgressChange}
                >
                  <motion.div 
                    className="h-full bg-white rounded-full relative shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white px-2 py-1 rounded text-[8px] font-mono text-black opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(audioRef.current?.currentTime || 0)}
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-12 relative z-10">
                <button className="text-white/40 hover:text-white transition-all">
                  <Heart size={24} />
                </button>
                <button 
                  className="text-white/40 hover:text-white hover:scale-110 active:scale-95 transition-all"
                  onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}
                >
                  <SkipBack size={32} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  className="text-white/40 hover:text-white hover:scale-110 active:scale-95 transition-all"
                  onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}
                >
                  <SkipForward size={32} />
                </button>
                <div className="flex items-center gap-4 w-32 group">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-all">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-white opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-8 text-center max-w-md">
              <div className="w-48 h-48 rounded-[48px] bg-white/5 border border-white/10 flex items-center justify-center relative">
                 <Disc size={80} className="text-white/5 animate-spin-slow" />
                 <Music className="absolute text-white/10" size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/20 mb-2">No Active Track</h3>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/10">Select a track from the library</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
