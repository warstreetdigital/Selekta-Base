import React, { useState } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { X, Search, CheckCircle2, AlertCircle, Ticket } from 'lucide-react';

interface GuestRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestRecoveryModal: React.FC<GuestRecoveryModalProps> = ({ isOpen, onClose }) => {
  const { recoverBooking, setActiveTab } = useTicketContext();
  const [bookingRef, setBookingRef] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) return;

    const res = recoverBooking(bookingRef, contactInfo);
    setResultMessage({
      success: res.success,
      text: res.message
    });

    if (res.success) {
      setTimeout(() => {
        onClose();
        setActiveTab('tickets');
      }, 1400);
    }
  };

  const handleQuickDemoFill = () => {
    setBookingRef('SB-8921-HRE');
    setContactInfo('tendai.moyo@gmail.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-sm bg-white border border-[#EAE9E2] rounded-3xl p-5 text-left shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F7F5F0] text-[#20231F] flex items-center justify-center hover:bg-[#EAE9E2]"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#E8F9F2] text-[#20C982] flex items-center justify-center">
            <Ticket className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-extrabold text-base text-[#20231F]">
            Recover Booking
          </h3>
        </div>
        <p className="text-xs text-[#777D75]">
          Enter your Booking Reference and the email or phone used at checkout.
        </p>

        {resultMessage && (
          <div className={`mt-3 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
            resultMessage.success 
              ? 'bg-[#E8F9F2] border-[#20C982]/40 text-[#169E65]'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {resultMessage.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleLookup} className="space-y-3 mt-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#777D75] block mb-1">
              Booking Reference
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SB-8921-HRE"
              value={bookingRef}
              onChange={e => setBookingRef(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#EAE9E2] text-xs font-mono uppercase text-[#20231F] focus:border-[#20C982] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#777D75] block mb-1">
              Phone or Email
            </label>
            <input
              type="text"
              required
              placeholder="+263 77X... or email"
              value={contactInfo}
              onChange={e => setContactInfo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#EAE9E2] text-xs text-[#20231F] focus:border-[#20C982] focus:outline-none"
            />
          </div>

          <div className="pt-1 space-y-1.5">
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#20C982] hover:bg-[#169E65] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Passes</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-1.5 text-center text-[11px] text-[#777D75] hover:text-[#20231F]"
            >
              Autofill Sample (SB-8921-HRE)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
