import React, { useState } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { TicketCard } from '../components/TicketCard';
import { Ticket, Search, QrCode } from 'lucide-react';

export const MyTicketsView: React.FC = () => {
  const { 
    allTickets, 
    setIsRecoveryOpen, 
    setIsScannerOpen, 
    setActiveTab 
  } = useTicketContext();

  const [filter, setFilter] = useState<'all' | 'valid' | 'checked_in'>('all');

  const filteredTickets = allTickets.filter(t => {
    if (filter === 'valid') return t.entryStatus === 'VALID';
    if (filter === 'checked_in') return t.entryStatus === 'CHECKED_IN';
    return true;
  });

  const validCount = allTickets.filter(t => t.entryStatus === 'VALID').length;

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-24 animate-fade-in pt-2">
      {/* Header Row */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-extrabold text-[#20231F] tracking-tight">
            My Digital Passes
          </h2>
          <p className="text-xs text-[#6F776D]">
            Stored locally • Ready for offline entrance
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRecoveryOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAE6DD] text-xs font-semibold text-[#20231F] hover:bg-[#DFDAD0] transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#20C982]" />
            <span>Recover</span>
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-7 h-7 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#20231F] hover:bg-[#DFDAD0] transition-colors"
            title="Gate Staff Scanner"
          >
            <QrCode className="w-3.5 h-3.5 text-[#20C982]" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {allTickets.length > 0 && (
        <div className="flex items-center gap-1.5 px-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-[#20231F] text-white'
                : 'bg-[#EAE6DD] text-[#6F776D]'
            }`}
          >
            All Passes ({allTickets.length})
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'valid'
                ? 'bg-[#20C982] text-white'
                : 'bg-[#EAE6DD] text-[#6F776D]'
            }`}
          >
            Valid ({validCount})
          </button>
          {allTickets.some(t => t.entryStatus === 'CHECKED_IN') && (
            <button
              onClick={() => setFilter('checked_in')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filter === 'checked_in'
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#EAE6DD] text-[#6F776D]'
              }`}
            >
              Checked In
            </button>
          )}
        </div>
      )}

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-[#EAE6DD] rounded-2xl border border-[#DED9CE] p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#DFDAD0] text-[#6F776D] flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6 text-[#20C982]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#20231F]">
              No Tickets on Device
            </h4>
            <p className="text-xs text-[#6F776D] mt-0.5">
              Discover official Selekta Base events or recover a previous booking.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-1.5 rounded-full bg-[#20C982] text-white text-xs font-bold shadow-xs hover:bg-[#169E65] transition-colors"
            >
              Explore Events
            </button>
            <button
              onClick={() => setIsRecoveryOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#DFDAD0] text-[#20231F] text-xs font-semibold hover:bg-[#D4CEBF] transition-colors"
            >
              Recover Pass
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 px-1">
          {filteredTickets.map(ticket => (
            <TicketCard key={ticket.ticketId} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};
