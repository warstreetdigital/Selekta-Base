import React, { useEffect, useState } from 'react';
import { SelectaEvent } from '../types';
import { useTicketContext } from '../context/TicketContext';
import { 
  X, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Lock,
  Wine,
  Play
} from 'lucide-react';
import { SELECTA_BASE_BRAND_POSTER } from '../data/mockEvents';

interface EventDetailModalProps {
  event: SelectaEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const { setCheckoutEvent, formatPrice, setActiveStoryId } = useTicketContext();
  const [showPolicies, setShowPolicies] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = startDate.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md max-h-[88vh] bg-[#FAF9F6] border border-[#DED9CE] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-20">
          {/* Compact Poster Artwork */}
          <div className="relative aspect-[16/10] w-full bg-[#EAE6DD] overflow-hidden">
            <img
              src={event.heroUrl || event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 flex items-center gap-2">
              <span className="bg-[#20C982] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {event.category.replace('_', ' ')}
              </span>
              {event.hasVideoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveStoryId('story-colour-run-2026');
                  }}
                  className="bg-black/75 hover:bg-[#20C982] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm transition-colors"
                >
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>Preview Video</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3.5">
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-1 text-xs text-[#20C982] font-bold mb-0.5">
                <span>Selekta Base Official</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xl font-extrabold text-[#20231F] leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Compact Date & Venue Info */}
            <div className="p-2.5 rounded-xl bg-[#EDEAE2] border border-[#DED9CE] space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#20231F]">
                <Calendar className="w-3.5 h-3.5 text-[#20C982]" />
                <span>{formattedDate} • {formattedTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6F776D]">
                <MapPin className="w-3.5 h-3.5 text-[#6F776D] shrink-0" />
                <span className="truncate">{event.venueName}, {event.city}</span>
              </div>
            </div>

            {/* Brief Description */}
            <p className="text-xs text-[#20231F]/90 leading-relaxed">
              {event.description}
            </p>

            {/* Ticket Categories List */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F776D] block">
                Tickets &amp; Pricing
              </span>

              <div className="space-y-1.5">
                {event.ticketTiers.map(tier => (
                  <div
                    key={tier.id}
                    className="p-2.5 rounded-xl bg-[#EDEAE2] border border-[#DED9CE] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#20231F]">{tier.name}</span>
                        {tier.phaseLabel && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E8F9F2] text-[#169E65]">
                            {tier.phaseLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#6F776D] block mt-0.5">
                        {tier.availableQuantity} passes left
                      </span>
                    </div>

                    <span className="text-sm font-black text-[#20231F]">
                      {formatPrice(tier.priceUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible Secondary Event Information */}
            <div className="rounded-xl border border-[#DED9CE] bg-[#EDEAE2] overflow-hidden text-xs">
              <button
                onClick={() => setShowPolicies(!showPolicies)}
                className="w-full p-2.5 flex items-center justify-between font-bold text-[#20231F] text-left"
              >
                <span>Event Information &amp; Entry Policies</span>
                {showPolicies ? <ChevronUp className="w-4 h-4 text-[#6F776D]" /> : <ChevronDown className="w-4 h-4 text-[#6F776D]" />}
              </button>

              {showPolicies && (
                <div className="p-3 pt-0 space-y-2 text-[11px] text-[#6F776D] border-t border-[#DED9CE]/60">
                  <div className="flex items-center gap-1.5 text-[#20231F] pt-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#20C982]" />
                    <span>Age: <strong>{event.policies.ageRestriction}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#20231F]">
                    <Wine className="w-3.5 h-3.5 text-[#20C982]" />
                    <span>Coolerbox: <strong>{event.policies.coolerboxAllowed ? 'Allowed (Permit Required)' : 'Not Allowed'}</strong></span>
                  </div>
                  {event.policies.gateRules && (
                    <ul className="list-disc list-inside space-y-0.5 pt-1 text-[10px]">
                      {event.policies.gateRules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[10px] text-[#6F776D] pt-1">
                    Refunds: {event.policies.refundPolicy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Booking Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#DED9CE] flex items-center justify-between gap-3 z-20">
          <div>
            <span className="text-[10px] text-[#6F776D] uppercase font-bold block leading-none">From</span>
            <span className="text-base font-black text-[#20231F]">
              {formatPrice(event.startingPriceUSD)}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              setCheckoutEvent(event);
            }}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#20C982] hover:bg-[#169E65] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
          >
            <span>Select Tickets &amp; Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
