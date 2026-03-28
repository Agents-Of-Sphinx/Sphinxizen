
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { listVideos } from '@/lib/videoService';
import VideoFeedItem from '@/components/VideoFeedItem';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';

export default function Home() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const fetchVideos = async () => {
    setLoading(true);
    const data = await listVideos();
    setVideos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      setActiveIndex(index);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <TopBar />
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.length === 0 ? (
          <div className="h-screen flex flex-col items-center justify-center text-white gap-4">
            <div className="text-6xl">🎬</div>
            <p className="text-gray-400">No videos yet. Upload the first one.</p>
          </div>
        ) : (
          videos.map((video, i) => (
            <VideoFeedItem
              key={video.id}
              video={video}
              isActive={i === activeIndex}
              currentUser={user}
            />
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}
