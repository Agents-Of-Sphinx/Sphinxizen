import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function VideoCard({ video, currentUser, onLikeToggle }) {
  const [hovered, setHovered] = useState(false);
  const isLiked = currentUser && video.liked_by?.includes(currentUser.email);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const liked_by = video.liked_by || [];
    const newLiked = isLiked
      ? liked_by.filter((e) => e !== currentUser.email)
      : [...liked_by, currentUser.email];
    await base44.entities.Video.update(video.id, {
      liked_by: newLiked,
      likes: newLiked.length,
    });
    onLikeToggle && onLikeToggle();
  };

  return (
    <Link to={`/video/${video.id}`} className="block group">
      <div
        className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] w-full cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <Play size={40} className="text-yellow-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-semibold truncate">{video.title}</p>
          <p className="text-gray-300 text-xs mt-0.5">{video.uploader_name || 'Anonymous'}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? 'text-red-400' : 'text-gray-300 hover:text-red-400'
              }`}
            >
              <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
              {video.likes || 0}
            </button>
            <span className="flex items-center gap-1 text-xs text-gray-300">
              <Eye size={13} />
              {video.views || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}