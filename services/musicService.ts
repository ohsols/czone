import { Category } from '../types';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnail: string | null;
  source: 'tidal' | 'soundcloud' | 'youtube';
  useBackend: boolean;
}

export async function searchMusic(query: string, source: string = 'all'): Promise<Track[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`/api/music/infamous/tidal/search/${encodedQuery}`);
    
    if (!response.ok) {
       console.warn('Infamous search failed with status:', response.status);
       throw new Error('Infamous search failed');
    }
    
    const data = await response.json();
    
    // Check if result is empty or error-like
    if (!Array.isArray(data) || data.length === 0) {
       throw new Error('No results from Infamous');
    }
    
    return data.map((item: any) => {
      let thumbnailUrl = null;
      if (item.thumbnail) {
        if (item.thumbnail.startsWith('/api/music/cover?u=')) {
          try {
            const b64 = item.thumbnail.split('u=')[1];
            const realUrl = atob(b64);
            thumbnailUrl = `/api/music/infamous/image?url=${encodeURIComponent(realUrl)}`;
          } catch (e) {
            thumbnailUrl = `/api/music/infamous/image?url=${encodeURIComponent(`https://infamous.qzz.io${item.thumbnail}`)}`;
          }
        } else {
          thumbnailUrl = `/api/music/infamous/image?url=${encodeURIComponent(item.thumbnail)}`;
        }
      } else if (item.album?.cover) {
        const tidalUrl = `https://resources.tidal.com/images/${item.album.cover.replace(/-/g, '/')}/320x320.jpg`;
        thumbnailUrl = `/api/music/infamous/image?url=${encodeURIComponent(tidalUrl)}`;
      }

      return {
        id: item.id?.toString() || '',
        title: item.title || 'Unknown Title',
        artist: item.artist?.name || item.artist || 'Unknown Artist',
        duration: item.duration || 0,
        thumbnail: thumbnailUrl,
        source: 'tidal',
        useBackend: true
      };
    });
  } catch (error) {
    console.warn('Primary search failed, trying fallback:', error);
    try {
      const fbResponse = await fetch(`/api/music/youtube/search?q=${encodeURIComponent(query)}`);
      if (!fbResponse.ok) return [];
      const fbData = await fbResponse.json();
      return fbData.map((item: any) => ({
        ...item,
        useBackend: false // YouTube results might need direct playback or another route
      }));
    } catch (fbError) {
      console.error('Fallback search failed:', fbError);
      return [];
    }
  }
}

export function getStreamUrl(track: Track): string {
  if (track.source === 'youtube') {
    return `/api/music/youtube/stream/${track.id}`;
  }
  // Use infamous proxy for streaming Tidal
  return `/api/music/infamous/tidal/stream/${track.id}`;
}
