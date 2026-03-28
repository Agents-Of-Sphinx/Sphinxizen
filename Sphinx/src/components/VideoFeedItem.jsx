
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Share2, Music2, Play, VolumeX, Volume2 } from 'lucide-react';

export default function VideoFeedItem({ video, isActive }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative h-screen w-full snap-start snap-always overflow-hidden bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={video.video_url}
        loop
        muted={muted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      <button className="absolute inset-0 w-full h-full z-10" onClick={togglePlay} />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/40 rounded-full p-5">
            <Play size={36} className="text-white fill-white" />
          </div>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        className="absolute top-16 right-4 z-30 bg-black/40 rounded-full p-2"
      >
        {muted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
      </button>

      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-5">
        <div className="relative mb-1">
          <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-black font-bold text-lg">
            {(video.uploader_name || 'A')[0].toUpperCase()}
          </div>
        </div>

        <Link to={`/video/${video.id}`} onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 flex items-center justify-center">
            <MessageCircle size={32} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold">Details</span>
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.share?.({ title: video.title, url: `${window.location.origin}/video/${video.id}` });
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 flex items-center justify-center">
            <Share2 size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold">Share</span>
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border-4 border-gray-600 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
          <Music2 size={14} className="text-white" />
        </div>
      </div>

      <div className="absolute bottom-20 left-3 right-20 z-30">
        <p className="text-white font-bold text-sm mb-0.5">@{(video.uploader_name || 'anonymous').toLowerCase().replace(/\s/g, '')}</p>
        <p className="text-white text-sm leading-snug mb-2 line-clamp-2">{video.title}</p>
        {video.description && <p className="text-gray-300 text-xs line-clamp-1">{video.description}</p>}
        {video.tags?.length > 0 && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-white text-xs font-semibold">#{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <Music2 size={12} className="text-white" />
          <p className="text-white text-xs">original sound - {video.uploader_name}</p>
        </div>
      </div>
    </div>
  );
}
