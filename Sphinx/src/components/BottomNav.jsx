
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const items = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: PlusSquare, label: 'Upload', path: '/upload', isUpload: true },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-t border-white/10 flex items-center justify-around px-4 py-2 pb-safe">
      {items.map(({ icon: Icon, label, path, isUpload }) => {
        const active = location.pathname === path;
        if (isUpload) {
          return (
            <Link key={path} to={path} className="flex items-center">
              <div className="relative">
                <div className="bg-white rounded-lg w-10 h-7 flex items-center justify-center">
                  <div className="absolute -left-2 top-0 bottom-0 w-3 bg-yellow-400 rounded-l-lg" />
                  <div className="absolute -right-2 top-0 bottom-0 w-3 bg-cyan-400 rounded-r-lg" />
                  <span className="text-black font-bold text-lg z-10 relative">+</span>
                </div>
              </div>
            </Link>
          );
        }
        return (
          <Link key={path} to={path} className="flex flex-col items-center gap-0.5">
            <Icon size={24} className={active ? 'text-white' : 'text-white/50'} />
            <span className={`text-[10px] ${active ? 'text-white font-semibold' : 'text-white/50'}`}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
