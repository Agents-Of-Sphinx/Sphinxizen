
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoById } from '@/lib/videoService';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Eye } from 'lucide-react';

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const item = await getVideoById(id);
      setVideo(item);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="relative bg-black">
        <Link to="/" className="absolute top-4 left-4 z-10 text-white bg-black/40 rounded-full p-2">
          <ArrowLeft size={18} />
        </Link>
        <video src={video.video_url} controls autoPlay className="w-full max-h-[60vh] object-contain bg-black" />
      </div>

      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black text-xs font-bold">
                {(video.uploader_name || 'A')[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold">@{(video.uploader_name || 'user').toLowerCase().replace(/\s/g, '')}</span>
            </div>
            <h1 className="text-sm font-medium leading-snug">{video.title}</h1>
            {video.description && <p className="text-gray-400 text-xs mt-1">{video.description}</p>}
            {video.tags?.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {video.tags.map((tag) => (
                  <span key={tag} className="text-yellow-400 text-xs font-semibold">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Eye size={12} className="text-gray-500" />
          <span className="text-xs text-gray-500">Stored in Firebase Storage</span>
        </div>
      </div>

      <div className="border-t border-white/10" />
      <div className="px-4 pt-4 text-sm text-gray-400">
        Comments, likes, and view tracking are not wired yet in this Firebase-only merge. The video catalog and uploads are.
      </div>

      <BottomNav />
    </div>
  );
}
