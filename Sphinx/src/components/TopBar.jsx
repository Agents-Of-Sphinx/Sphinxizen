import { useState } from 'react';
import { Search } from 'lucide-react';

export default function TopBar() {
  const [tab, setTab] = useState('for-you');

  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center gap-6 pt-3 pb-2">
      <button
        onClick={() => setTab('following')}
        className={`text-sm font-semibold transition ${tab === 'following' ? 'text-white' : 'text-white/50'}`}
      >
        Following
      </button>
      <div className="relative">
        <span className="text-[22px] font-bold italic font-serif text-white drop-shadow">Sphinx</span>
      </div>
      <button
        onClick={() => setTab('for-you')}
        className={`text-sm font-semibold transition ${tab === 'for-you' ? 'text-white border-b-2 border-yellow-400' : 'text-white/50'}`}
      >
        For You
      </button>
    </div>
  );
}