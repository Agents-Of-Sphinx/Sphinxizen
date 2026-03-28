
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { uploadVideoWithMetadata } from '@/lib/videoService';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Upload as UploadIcon, X, Video, Image } from 'lucide-react';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', tags: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 pb-20">
        <p className="text-gray-400">You must be logged in to upload</p>
        <Link to="/profile" className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-sm text-sm">
          Go to profile / login
        </Link>
        <BottomNav />
      </div>
    );
  }

  const handleThumbnail = (file) => {
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }
    try {
      setUploading(true);
      setError('');
      const id = await uploadVideoWithMetadata({
        file: videoFile,
        thumbnailFile,
        title: form.title,
        description: form.description,
        tags: form.tags,
        user,
        onProgress: setProgress,
      });
      navigate(`/video/${id}`);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="flex items-center gap-4 px-4 pt-12 pb-4 border-b border-white/10">
        <Link to="/" className="text-white">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-bold text-base">Upload Video</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-5 space-y-5">
        <label className="block">
          <div className="border border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-yellow-400/60 transition">
            {videoFile ? (
              <div className="flex items-center gap-2 text-sm">
                <Video size={18} className="text-yellow-400" />
                <span className="text-gray-300 truncate max-w-[200px]">{videoFile.name}</span>
                <button type="button" onClick={() => setVideoFile(null)} className="text-gray-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <UploadIcon size={24} className="text-yellow-400" />
                </div>
                <p className="text-sm text-gray-400">Tap to select video</p>
              </>
            )}
          </div>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files[0])} />
        </label>

        <label className="block">
          <p className="text-xs text-gray-400 mb-2">Cover photo (optional)</p>
          <div className="border border-dashed border-white/20 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:border-yellow-400/60 transition">
            {thumbnailPreview ? (
              <>
                <img src={thumbnailPreview} alt="cover" className="w-16 h-24 object-cover rounded-md" />
                <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }} className="text-gray-500 hover:text-white">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <Image size={20} className="text-gray-500" />
                <span className="text-sm text-gray-500">Add cover photo</span>
              </>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnail(e.target.files[0])} />
        </label>

        <div>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Add a title..."
            className="w-full bg-white/5 border-0 border-b border-white/20 px-0 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        <div>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your video..."
            className="w-full bg-white/5 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none border border-white/10"
          />
        </div>

        <div>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="#tags, #funny, #dance"
            className="w-full bg-white/5 border-0 border-b border-white/20 px-0 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {uploading && (
          <div className="text-sm text-gray-400">Uploading... {progress}%</div>
        )}
        {error && <div className="text-sm text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-sm text-sm hover:bg-yellow-300 transition"
        >
          {uploading ? 'Uploading...' : 'Post'}
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
