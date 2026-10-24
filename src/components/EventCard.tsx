import React, { useState } from 'react';
import { SelectaEvent } from '../types';
import { useTicketContext } from '../context/TicketContext';
import { SELECTA_BASE_BRAND_POSTER } from '../data/mockEvents';
import { Calendar, MapPin, CheckCircle2, ArrowRight, Play } from 'lucide-react';

interface EventCardProps {
  event: SelectaEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { setSelectedEvent, setCheckoutEvent, formatPrice, setActiveStoryId } = useTicketContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(event.startDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Short snippet of ~95 characters for consistent collapsed card height
  const isDescriptionLong = event.description.length > 95;
  const descriptionSnippet = isDescriptionLong && !isExpanded 
    ? event.description.slice(0, 95).trim()
    : event.description;

  const isSalesOpen = event.status === 'on_sale' || event.status === 'almost_sold_out';

  const handleWatchVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStoryId('story-colour-run-2026');
  };

  return (
    <article className="bg-[#EAE5DB] rounded-2xl border border-[#DCD6CB] overflow-hidden transition-all shadow-[0_2px_8px_rgba(32,35,31,0.03)] hover:border-[#20C982]/60">
      {/* A. Publisher Row */}
      <div className="px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#20C982] flex items-center justify-center text-white text-[10px] font-black shrink-0">
            SB
          </div>
          <div className="flex items-center gap-1 leading-none">
            <span className="font-extrabold text-xs text-[#20231F]">
              Selekta Base
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#20C982] fill-[#20C982]/20" />
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#6F776D]">
          {event.city}
        </span>
      </div>

      {/* B. Hero Image */}
      <div 
        onClick={() => setSelectedEvent(event)}
        className="relative cursor-pointer bg-[#DFDAD0] overflow-hidden aspect-[16/10]"
      >
        <img
          src={event.heroUrl || event.posterUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
          }}
        />
        
        {/* Category label */}
        <div className="absolute bottom-2.5 left-3">
          <span className="bg-[#EAE5DB]/95 backdrop-blur-md text-[#20231F] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
            {event.category.replace('_', ' ')}
          </span>
        </div>

        {/* Optional video preview badge */}
        {event.hasVideoPreview && (
          <button
            onClick={handleWatchVideo}
            className="absolute top-2.5 right-2.5 bg-black/75 hover:bg-[#20C982] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-colors shadow-sm active:scale-95"
            title="Watch Official Preview Video"
          >
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>Video Preview</span>
          </button>
        )}
      </div>

      {/* Card Content: Title, Date/Venue, Description, Actions */}
      <div className="p-3.5 space-y-2.5">
        {/* C. Event Title */}
        <div>
          <h3 
            onClick={() => setSelectedEvent(event)}
            className="font-black text-base text-[#20231F] hover:text-[#20C982] transition-colors cursor-pointer leading-snug tracking-tight"
          >
            {event.title}
          </h3>

          {/* D. Date and Venue Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#6F776D] mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 font-bold text-[#20231F]">
              <Calendar className="w-3.5 h-3.5 text-[#20C982]" />
              <span>{formattedDate} • {formattedTime}</span>
            </span>
            <span className="text-[#B8B2A6]">•</span>
            <span className="flex items-center gap-1 truncate text-[#6F776D]">
              <MapPin className="w-3.5 h-3.5 text-[#6F776D] shrink-0" />
              <span className="truncate">{event.venueName}</span>
            </span>
          </div>

          {/* E. Substantially Improved Description with Inline ...more / less */}
          <div className="mt-2 text-xs text-[#6F776D] leading-relaxed">
            <span>{descriptionSnippet}</span>
            {isDescriptionLong && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-[#20231F] font-bold hover:text-[#20C982] ml-1 text-xs cursor-pointer focus:outline-none"
              >
                {isExpanded ? ' less' : '...more'}
              </button>
            )}
          </div>
        </div>

        {/* F. Price and Action Row */}
        <div className="pt-2 border-t border-[#DCD6CB] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6F776D] uppercase font-bold block leading-none">
              {isSalesOpen ? 'From' : 'Passes'}
            </span>
            <span className="text-sm font-black text-[#20231F]">
              {isSalesOpen ? formatPrice(event.startingPriceUSD) : 'TBA'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedEvent(event)}
              className="py-1.5 px-3 rounded-full bg-[#DFDAD0] hover:bg-[#D4CEBF] text-[#20231F] text-xs font-bold transition-colors"
            >
              Details
            </button>

            {isSalesOpen ? (
              <button
                onClick={() => setCheckoutEvent(event)}
                className="py-1.5 px-3.5 rounded-full bg-[#20C982] hover:bg-[#169E65] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
              >
                <span>Get Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="py-1.5 px-3.5 rounded-full bg-[#DFDAD0] text-[#6F776D] text-xs font-bold">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
