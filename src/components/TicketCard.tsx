import React, { useState } from 'react';
import { DigitalTicket } from '../types';
import { useTicketContext } from '../context/TicketContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { 
  Calendar, 
  MapPin, 
  Maximize2, 
  Share2, 
  Check, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  X,
  Smartphone
} from 'lucide-react';

interface TicketCardProps {
  ticket: DigitalTicket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { checkInTicket } = useTicketContext();
  const [isFullscreenQR, setIsFullscreenQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [checkInFeedback, setCheckInFeedback] = useState<string | null>(null);

  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const formattedTime = new Date(ticket.eventDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const shareableUrl = `https://selektabase.co.zw/pass/${ticket.shareableToken}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSimulateCheckIn = () => {
    const res = checkInTicket(ticket.ticketId, 'Gate 1 (Express)');
    setCheckInFeedback(res.message);
    setTimeout(() => setCheckInFeedback(null), 3500);
  };

  const renderStatusBadge = () => {
    if (ticket.entryStatus === 'CHECKED_IN') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Check className="w-3 h-3" />
          Checked In
        </span>
      );
    }
    if (ticket.entryStatus === 'REVOKED') {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3" />
          Revoked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-[#E8F9F2] text-[#169E65] border border-[#20C982]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
        <ShieldCheck className="w-3 h-3 text-[#20C982]" />
        Valid Pass
      </span>
    );
  };

  return (
    <>
      <div className="relative bg-[#EAE6DD] rounded-2xl border border-[#DED9CE] overflow-hidden shadow-2xs hover:border-[#20C982]/60 transition-all">
        {/* Ticket Header */}
        <div className="px-3.5 py-2.5 bg-[#DFDAD0] border-b border-[#DED9CE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#20231F]">
              {ticket.tierName}
            </span>
            {renderStatusBadge()}
          </div>
          <span className="text-[11px] font-mono text-[#6F776D] font-semibold">
            {ticket.orderReference}
          </span>
        </div>

        {/* Ticket Body with Details & QR Code */}
        <div className="p-3.5 flex flex-col sm:flex-row gap-3.5 items-center">
          {/* Details */}
          <div className="flex-1 space-y-1.5 w-full">
            <div>
              <h3 className="font-extrabold text-base text-[#20231F] leading-snug">
                {ticket.eventTitle}
              </h3>
              <p className="text-xs text-[#20C982] font-semibold mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate} • {formattedTime}</span>
              </p>
            </div>

            <div className="flex items-start gap-1 text-xs text-[#6F776D]">
              <MapPin className="w-3.5 h-3.5 text-[#6F776D] shrink-0 mt-0.5" />
              <span className="truncate">{ticket.eventVenue}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-[#DED9CE] text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#6F776D] block">Holder</span>
                <span className="font-bold text-[#20231F] truncate block">{ticket.holderName}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#6F776D] block">Ticket ID</span>
                <span className="font-mono text-xs font-bold text-[#20231F]">{ticket.ticketId}</span>
              </div>
            </div>

            {ticket.entryStatus === 'CHECKED_IN' && ticket.checkInTimestamp && (
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                Admitted at {ticket.checkInGate} ({new Date(ticket.checkInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </div>
            )}

            {checkInFeedback && (
              <div className="p-2 rounded-xl bg-[#E8F9F2] border border-[#20C982]/40 text-[#169E65] text-xs font-medium">
                {checkInFeedback}
              </div>
            )}
          </div>

          {/* QR Code Container */}
          <div className="shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-[#FAF9F6] border border-[#DED9CE] w-full sm:w-auto">
            <div 
              onClick={() => setIsFullscreenQR(true)}
              className="cursor-pointer p-1.5 bg-white rounded-lg shadow-2xs hover:scale-102 transition-transform"
              title="Tap to enlarge for gate scanner"
            >
              <QRCodeDisplay value={ticket.qrPayload} size={110} />
            </div>
            <span className="text-[10px] text-[#6F776D] font-medium mt-1 flex items-center gap-1">
              <QrCode className="w-3 h-3 text-[#20C982]" />
              Tap to present
            </span>
          </div>
        </div>

        {/* Perforated Dotted Divider */}
        <div className="relative flex items-center justify-between px-4">
          <div className="w-3 h-3 rounded-full bg-[#F7F5F0] -ml-5.5 border border-[#DED9CE]" />
          <div className="w-full border-b border-dashed border-[#DED9CE]" />
          <div className="w-3 h-3 rounded-full bg-[#F7F5F0] -mr-5.5 border border-[#DED9CE]" />
        </div>

        {/* Action Row */}
        <div className="px-3.5 py-2 bg-[#DFDAD0] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreenQR(true)}
              className="py-1 px-2.5 rounded-full bg-[#FAF9F6] border border-[#DED9CE] text-[#20231F] font-semibold flex items-center gap-1 hover:border-[#20C982] transition-colors"
            >
              <Maximize2 className="w-3 h-3 text-[#20C982]" />
              <span>Gate Pass</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-1 px-2.5 rounded-full bg-[#FAF9F6] border border-[#DED9CE] text-[#6F776D] hover:text-[#20231F] font-medium flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <button
            onClick={handleSimulateCheckIn}
            disabled={ticket.entryStatus === 'CHECKED_IN'}
            className="py-1 px-2.5 rounded-full bg-[#E8F9F2] hover:bg-[#d6f5e8] disabled:opacity-40 text-[#169E65] font-bold border border-[#20C982]/30 transition-colors"
          >
            Test Scan
          </button>
        </div>
      </div>

      {/* FULLSCREEN GATE PASS MODAL */}
      {isFullscreenQR && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="w-full max-w-xs bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFullscreenQR(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F5F0] text-[#20231F] flex items-center justify-center hover:bg-[#EAE9E2]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#169E65] bg-[#E8F9F2] px-2.5 py-0.5 rounded-full">
                Gate Entrance Pass
              </span>
              <h3 className="font-extrabold text-base text-[#20231F] mt-2">
                {ticket.eventTitle}
              </h3>
              <p className="text-xs text-[#777D75] mt-0.5">
                {ticket.tierName} • {ticket.holderName}
              </p>
            </div>

            {/* High Brightness QR container */}
            <div className="p-3 bg-white border border-[#EAE9E2] rounded-2xl mx-auto inline-block shadow-sm">
              <QRCodeDisplay value={ticket.qrPayload} size={200} />
            </div>

            <div className="p-2 rounded-xl bg-[#F7F5F0] text-xs text-[#777D75] space-y-0.5">
              <p className="flex items-center justify-center gap-1 text-[#20231F] font-semibold text-[11px]">
                <Smartphone className="w-3.5 h-3.5 text-[#20C982]" />
                <span>Turn brightness to high</span>
              </p>
              <p className="font-mono text-[10px]">
                {ticket.ticketId}
              </p>
            </div>

            <button
              onClick={() => setIsFullscreenQR(false)}
              className="w-full py-2.5 rounded-full bg-[#20231F] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
