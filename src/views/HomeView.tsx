import React, { useState, useMemo } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { EventCard } from '../components/EventCard';
import { EventStories } from '../components/EventStories';
import { Header } from '../components/Header';
import { Search, X } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { events } = useTicketContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const feedEvents = useMemo(() => {
    return events.filter(e => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });
  }, [events, searchQuery]);

  return (
    <div className="relative -mx-3.5 -mt-1 pb-24 animate-fade-in">
      {/* 1. Refined Sticky Header */}
      <Header 
        onSearchClick={() => setIsSearchOpen(prev => !prev)} 
        isSearchActive={isSearchOpen || !!searchQuery}
      />

      {/* Main Home Container */}
      <div className="max-w-md mx-auto px-3.5 space-y-3.5 pt-2">
        {/* Clean, Non-intrusive Search Input when toggled */}
        {isSearchOpen && (
          <div className="relative animate-fade-in">
            <input
              type="text"
              autoFocus
              placeholder="Search official events, venues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#EAE5DB] border border-[#DCD6CB] text-xs text-[#20231F] placeholder-[#6F776D] focus:outline-none focus:border-[#20C982] transition-colors shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6F776D]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#6F776D] hover:text-[#20231F]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* 2. Living Event Stories Row (Flows directly from header) */}
        <div>
          <EventStories />
        </div>

        {/* 3. Official Selekta Base Event Feed (Direct flow, no category navigation row) */}
        <div className="space-y-4 pt-1">
          {feedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}

          {feedEvents.length === 0 && (
            <div className="bg-[#EAE5DB] rounded-2xl p-6 text-center space-y-2 border border-[#DCD6CB]">
              <p className="text-xs text-[#6F776D]">
                No official events found matching "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="px-4 py-1.5 rounded-full bg-[#20C982] text-white text-xs font-bold"
              >
                Show All Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
