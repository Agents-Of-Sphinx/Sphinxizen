
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { deleteVideo, listVideos } from '@/lib/videoService';
import BottomNav from '@/components/BottomNav';
import { Play, Trash2, Settings, LogOut } from 'lucide-react';

function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form.email, form.password, form.fullName);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-12 pb-24">
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Sphinx</h1>
        <p className="text-sm text-gray-400 mb-6">Use your existing Firebase Auth users here.</p>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-md ${mode === 'login' ? 'bg-yellow-400 text-black font-semibold' : 'bg-white/5 text-white'}`}>Log in</button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-2 rounded-md ${mode === 'signup' ? 'bg-yellow-400 text-black font-semibold' : 'bg-white/5 text-white'}`}>Sign up</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2" />
          )}
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="w-full bg-yellow-400 text-black font-bold py-2.5 rounded-md">{loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyVideos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const all = await listVideos();
    setMyVideos(all.filter((video) => video.uploader_email && video.uploader_email === user.email));
    setLoading(false);
  };

  useEffect(() => {
    fetchMyVideos();
  }, [user]);

  const handleDelete = async (video) => {
    if (!window.confirm('Delete this video?')) return;
    await deleteVideo(video);
    setMyVideos((prev) => prev.filter((item) => item.id !== video.id));
  };

  const stats = useMemo(() => ({
    videos: myVideos.length,
  }), [myVideos]);

  if (!user) return <AuthForm />;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <div className="w-8" />
        <p className="font-bold text-base">{user.displayName || user.email}</p>
        <Settings size={20} className="text-white" />
      </div>

      <div className="flex flex-col items-center px-4 pb-4">
        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-black text-3xl font-bold mb-3">
          {(user.displayName || user.email || '?')[0].toUpperCase()}
        </div>
        <p className="text-sm text-gray-400 mb-1">{user.email}</p>
        <p className="text-sm text-gray-400 mb-3">@{(user.displayName || user.email?.split('@')[0] || 'user').toLowerCase().replace(/\s/g, '')}</p>

        <div className="flex gap-8 text-center mb-4">
          <div>
            <p className="font-bold text-lg">{stats.videos}</p>
            <p className="text-xs text-gray-400">Videos</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/upload" className="border border-white/30 text-white text-sm font-semibold px-6 py-1.5 rounded-sm hover:bg-white/10 transition">
            + Upload Video
          </Link>
          <button onClick={logout} className="border border-white/30 text-white text-sm font-semibold px-6 py-1.5 rounded-sm hover:bg-white/10 transition flex items-center gap-2">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="border-b border-white/10 mb-0.5" />

      {loading ? (
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {Array(6).fill(0).map((_, i) => <div key={i} className="aspect-[9/16] bg-gray-900 animate-pulse" />)}
        </div>
      ) : myVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
          <div className="text-5xl">🎬</div>
          <p>No videos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {myVideos.map((video) => (
            <div key={video.id} className="relative group aspect-[9/16]">
              <Link to={`/video/${video.id}`}>
                <div className="w-full h-full bg-gray-900 overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={20} className="text-yellow-400" />
                    </div>
                  )}
                </div>
              </Link>
              <button onClick={() => handleDelete(video)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
