
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Upload, User, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const linkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium italic transition-opacity hover:opacity-70 ${
      location.pathname === path ? 'underline' : ''
    }`;

  return (
    <nav className="w-full bg-yellow-400 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link to="/" className="text-2xl font-bold italic font-serif text-black">
        Sphinx
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/profile" className={linkClass('/profile')}>
          <User size={15} /> Profile
        </Link>
        <Link to="/upload" className={linkClass('/upload')}>
          <Upload size={15} /> Upload Video
        </Link>
        {user ? (
          <button onClick={logout} className="flex items-center gap-1.5 text-sm font-medium italic hover:opacity-70 transition-opacity">
            <LogOut size={15} /> Logout
          </button>
        ) : (
          <Link to="/profile" className={linkClass('/profile')}>
            <LogIn size={15} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}
