import React, { useState, useMemo } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { EventCard } from '../components/EventCard';
import { EventCategory } from '../types';
import { 
  Search, 
  X, 
  LayoutGrid, 
  List 
} from 'lucide-react';
import { SELECTA_BASE_BRAND_POSTER } from '../data/mockEvents';

export const ExploreView: React.FC = () => {
  const { events, setSelectedEvent, formatPrice } = useTicketContext();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');

  const categories: { id: EventCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'music', label: 'Music' },
    { id: 'lifestyle', label: 'Family & Culture' },
  ];

  const cities = ['all', 'Harare', 'Bulawayo'];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const q = search.toLowerCase();
      const matchSearch = 
        !search ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q);

      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      const matchCity = selectedCity === 'all' || e.city.toLowerCase() === selectedCity.toLowerCase();

      return matchSearch && matchCat && matchCity;
    });
  }, [events, search, selectedCategory, selectedCity]);

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-24 animate-fade-in pt-2">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-extrabold text-[#20231F] tracking-tight">
          Explore Selekta Base
        </h2>
        <p className="text-xs text-[#6F776D]">
          Official events, sound systems and family festivals
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative px-1">
        <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-[#6F776D]" />
        <input
          type="text"
          placeholder="Search events, venues..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 rounded-full bg-[#EAE6DD] border border-[#DED9CE] text-xs text-[#20231F] placeholder-[#6F776D] focus:outline-none focus:border-[#20C982]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-2 text-[#6F776D] hover:text-[#20231F]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-1.5 px-1">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#20231F] text-white'
                  : 'bg-[#EAE6DD] text-[#6F776D] hover:text-[#20231F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="text-[11px] font-bold text-[#20231F] bg-[#EAE6DD] border border-[#DED9CE] rounded-full px-2 py-1 focus:outline-none"
          >
            <option value="all">All</option>
            {cities.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'feed' : 'grid')}
            className="w-7 h-7 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#6F776D] hover:text-[#20231F]"
            title="Toggle View Mode"
          >
            {viewMode === 'grid' ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Content: Poster Grid or Feed */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-2.5 px-1">
          {filteredEvents.map(event => {
            const formattedDate = new Date(event.startDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short'
            });

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="group relative bg-[#EAE6DD] rounded-2xl border border-[#DED9CE] overflow-hidden cursor-pointer shadow-2xs hover:border-[#20C982]/60 transition-all"
              >
                <div className="aspect-[4/5] w-full bg-[#DFDAD0] overflow-hidden relative">
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#EAE6DD]/95 backdrop-blur-md text-[#20231F] text-[10px] font-black px-2 py-0.5 rounded-md">
                      {formattedDate}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                    <span className="text-xs font-black drop-shadow-sm">
                      {formatPrice(event.startingPriceUSD)}
                    </span>
                    <span className="text-[9px] uppercase font-bold opacity-85">
                      {event.city}
                    </span>
                  </div>
                </div>

                <div className="p-2 space-y-0.5">
                  <h4 className="font-bold text-xs text-[#20231F] truncate group-hover:text-[#20C982] transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-[10px] text-[#6F776D] truncate">
                    {event.venueName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4 px-1">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="bg-[#EAE6DD] rounded-2xl p-6 text-center space-y-2 border border-[#DED9CE]">
          <p className="text-xs text-[#6F776D]">
            No matching events found.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedCity('all');
            }}
            className="px-3.5 py-1 rounded-full bg-[#20C982] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
