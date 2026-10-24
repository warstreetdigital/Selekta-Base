import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  isSearchActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, isSearchActive = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-30 transition-all duration-200 px-4 py-2.5 ${
        isScrolled 
          ? 'bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#E3DDD1] shadow-[0_2px_8px_rgba(32,35,31,0.04)]' 
          : 'bg-[#F7F5F0]/90 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Compact, Confident SELEKTA BASE Wordmark + Zimbabwe Indicator */}
        <div className="flex items-center gap-2">
          <span className="font-black text-sm tracking-widest uppercase text-[#20231F] select-none">
            SELEKTA <span className="text-[#20C982]">BASE</span>
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EAE5DB] border border-[#DDD6C8] text-[9px] font-bold text-[#6F776D] tracking-wider uppercase select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20C982]"></span>
            <span>ZW</span>
          </div>
        </div>

        {/* Clean Circular Search Action */}
        <button
          onClick={onSearchClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
            isSearchActive 
              ? 'bg-[#20231F] text-white shadow-xs' 
              : 'bg-[#EAE5DB] text-[#20231F] hover:bg-[#DFDAD0] hover:text-[#20C982]'
          }`}
          title="Search events"
          aria-label="Search events"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};

