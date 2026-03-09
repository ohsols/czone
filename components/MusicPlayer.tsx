import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Pause, SkipBack, SkipForward, Repeat, Volume2, Music, Loader2, RotateCcw, RotateCw } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  streamUrl?: string;
}

const MusicPlayer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  const searchSongs = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.monochrome.tf/search?s=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.items) {
        console.error('Invalid API response:', data);
        setTracks([]);
        return;
      }

      const formattedTracks: Track[] = data.data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        artist: item.artist.name,
        album: item.album.title,
        cover: `https://resources.tidal.com/images/${item.album.cover.replace(/-/g, '/')}/640x640.jpg`,
        streamUrl: undefined // Will be fetched on play
      }));

      setTracks(formattedTracks);
      if (formattedTracks.length > 0 && currentTrackIndex === null) {
        // Don't auto-play on search, just show results
        // setCurrentTrackIndex(0); 
      }
    } catch (error) {
      console.error('Error searching music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreamUrl = async (trackId: number) => {
    try {
      const response = await fetch(`https://api.monochrome.tf/track?id=${trackId}&quality=HIGH`);
      const data = await response.json();
      const manifest = JSON.parse(atob(data.data.manifest));
      return manifest.urls[0];
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      return null;
    }
  };

  const playTrack = async (index: number) => {
    const track = tracks[index];
    if (!track.streamUrl) {
      setIsLoading(true);
      const url = await fetchStreamUrl(track.id);
      if (url) {
        const newTracks = [...tracks];
        newTracks[index] = { ...track, streamUrl: url };
        setTracks(newTracks);
        // Update current track ref indirectly by state update, but we need to play it now
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().catch(e => console.error("Playback failed", e));
            setIsPlaying(true);
        }
      }
      setIsLoading(false);
    } else {
       if (audioRef.current) {
          audioRef.current.src = track.streamUrl;
          audioRef.current.play().catch(e => console.error("Playback failed", e));
          setIsPlaying(true);
       }
    }
    setCurrentTrackIndex(index);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const skipTime = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const nextTrack = () => {
    if (tracks.length === 0 || currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  const prevTrack = () => {
    if (tracks.length === 0 || currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  // Effect to handle play/pause when isPlaying changes is not enough because we need to load src first
  // We handle src loading in playTrack. 
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Player Section */}
        <div className="w-full md:w-1/3 space-y-6 sticky top-24">
          <div className="aspect-square w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 group relative">
            {currentTrack ? (
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#1c1c1f]">
                <Music size={80} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-white truncate">{currentTrack?.title || 'No Song Selected'}</h2>
              <p className="text-[#a1a1aa] font-medium">{currentTrack?.artist || 'Search for music'}</p>
            </div>

            <div className="space-y-2">
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={progress} 
                onChange={handleSeek}
                className="w-full h-1 bg-[#1c1c1f] rounded-lg appearance-none cursor-pointer accent-[#ff2644]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#52525b] uppercase tracking-widest">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-colors ${isRepeat ? 'text-[#ff2644]' : 'text-[#52525b] hover:text-white'}`}
                title="Repeat"
              >
                <Repeat size={20} />
              </button>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => skipTime(-10)}
                  className="text-[#52525b] hover:text-white transition-colors"
                  title="-10s"
                >
                  <RotateCcw size={20} />
                </button>
                
                <button 
                  onClick={prevTrack}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <SkipBack size={28} fill="currentColor" />
                </button>

                <button 
                  onClick={togglePlay}
                  disabled={!currentTrack}
                  className="w-14 h-14 bg-[#ff2644] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,38,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>

                <button 
                  onClick={nextTrack}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <SkipForward size={28} fill="currentColor" />
                </button>

                <button 
                  onClick={() => skipTime(10)}
                  className="text-[#52525b] hover:text-white transition-colors"
                  title="+10s"
                >
                  <RotateCw size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search & List Section */}
        <div className="flex-1 w-full space-y-6">
          <form onSubmit={searchSongs} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b] group-focus-within:text-[#ff2644] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-[#1c1c1f] rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#ff2644] transition-all placeholder:text-[#52525b]"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-[#ff2644]" size={20} />
              </div>
            )}
          </form>

          <div className="bg-black border border-[#1c1c1f] rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#1c1c1f] flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#a1a1aa]">Music Results</h3>
              <span className="text-[10px] font-mono text-[#52525b]">{tracks.length} Tracks Found</span>
            </div>
            
            <div className="divide-y divide-[#1c1c1f] max-h-[600px] overflow-y-auto custom-scrollbar">
              {tracks.length > 0 ? (
                tracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(index)}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group ${currentTrackIndex === index ? 'bg-white/5' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                      {currentTrackIndex === index && isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="flex gap-0.5 items-end h-4">
                            <div className="w-1 bg-[#ff2644] animate-[music-bar_0.6s_ease-in-out_infinite]" />
                            <div className="w-1 bg-[#ff2644] animate-[music-bar_0.8s_ease-in-out_infinite_0.1s]" />
                            <div className="w-1 bg-[#ff2644] animate-[music-bar_0.7s_ease-in-out_infinite_0.2s]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className={`font-bold truncate ${currentTrackIndex === index ? 'text-[#ff2644]' : 'text-white'}`}>{track.title}</h4>
                      <p className="text-xs text-[#a1a1aa] truncate">{track.artist} • {track.album}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} className="text-[#ff2644]" fill="currentColor" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-[#1c1c1f] rounded-full flex items-center justify-center mx-auto text-[#52525b]">
                    <Search size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-bold">Search Music</p>
                    <p className="text-xs text-[#52525b]">Find your favorite tracks and listen instantly</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
