import React, { useState } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { 
  X, 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search,
  History
} from 'lucide-react';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScanLogEntry {
  id: string;
  ticketId: string;
  status: 'VALID' | 'ALREADY_USED' | 'NOT_FOUND' | 'REVOKED';
  message: string;
  timestamp: string;
  holderName?: string;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({ isOpen, onClose }) => {
  const { allTickets, checkInTicket } = useTicketContext();
  const [selectedGate, setSelectedGate] = useState('Main Gate 1');
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState<ScanLogEntry | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanLogEntry[]>([]);

  if (!isOpen) return null;

  const handleScan = (inputVal: string) => {
    const code = inputVal.trim();
    if (!code) return;

    const res = checkInTicket(code, selectedGate);
    const entry: ScanLogEntry = {
      id: Math.random().toString(),
      ticketId: res.ticket ? res.ticket.ticketId : code,
      status: res.status,
      message: res.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      holderName: res.ticket?.holderName,
    };

    setScanResult(entry);
    setScanHistory(prev => [entry, ...prev.slice(0, 7)]);
    setTicketInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white border border-[#EAE9E2] rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#EAE9E2] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F9F2] text-[#20C982] flex items-center justify-center">
              <ScanLine className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#20231F]">
                Gate Staff Scanner
              </h3>
              <p className="text-[11px] text-[#777D75]">
                Entrance QR Verification &amp; Anti-Duplicate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white border border-[#EAE9E2] text-[#20231F] flex items-center justify-center hover:bg-[#F7F5F0]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Gate Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F5F0] border border-[#EAE9E2] text-xs">
            <span className="font-bold text-[#777D75]">Gate:</span>
            <select
              value={selectedGate}
              onChange={e => setSelectedGate(e.target.value)}
              className="bg-white border border-[#EAE9E2] text-xs font-bold text-[#20231F] rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="Main Gate 1">Main Gate 1</option>
              <option value="Gate 2 (VIP)">Gate 2 (VIP)</option>
              <option value="Gate 3 (Coolerbox)">Gate 3 (Coolerbox)</option>
            </select>
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleScan(ticketInput);
            }}
            className="flex gap-1.5"
          >
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#777D75]" />
              <input
                type="text"
                placeholder="Enter Ticket ID..."
                value={ticketInput}
                onChange={e => setTicketInput(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 rounded-full bg-[#F7F5F0] border border-[#EAE9E2] text-xs font-mono text-[#20231F] focus:border-[#20C982] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!ticketInput.trim()}
              className="py-2 px-3.5 rounded-full bg-[#20C982] hover:bg-[#169E65] disabled:opacity-40 text-white font-bold text-xs"
            >
              Scan
            </button>
          </form>

          {/* Quick Test Passes */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777D75] block">
              Quick Test Current Passes:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {allTickets.slice(0, 4).map(t => (
                <button
                  key={t.ticketId}
                  onClick={() => handleScan(t.ticketId)}
                  className={`p-2 rounded-xl text-left border text-[11px] truncate ${
                    t.entryStatus === 'CHECKED_IN'
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-[#F7F5F0] border-[#EAE9E2] hover:border-[#20C982] text-[#20231F]'
                  }`}
                >
                  <span className="font-mono font-bold block">{t.ticketId}</span>
                  <span className="truncate block text-[#777D75]">{t.holderName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Result Banner */}
          {scanResult && (
            <div className={`p-3 rounded-2xl border text-left space-y-1 animate-fade-in ${
              scanResult.status === 'VALID' 
                ? 'bg-[#E8F9F2] border-[#20C982] text-[#169E65]'
                : scanResult.status === 'ALREADY_USED'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              <div className="flex items-center gap-1.5 font-black text-xs uppercase">
                {scanResult.status === 'VALID' && <CheckCircle2 className="w-4 h-4 text-[#20C982]" />}
                {scanResult.status === 'ALREADY_USED' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {scanResult.status === 'NOT_FOUND' && <XCircle className="w-4 h-4 text-red-600" />}
                <span>
                  {scanResult.status === 'VALID' && 'Entry Verified • Admitted'}
                  {scanResult.status === 'ALREADY_USED' && 'Duplicate Entry Rejected!'}
                  {scanResult.status === 'NOT_FOUND' && 'Invalid Ticket Code'}
                </span>
              </div>
              <p className="text-[11px] leading-snug">
                {scanResult.message}
              </p>
            </div>
          )}

          {/* Recent Audit Log */}
          {scanHistory.length > 0 && (
            <div className="pt-2 border-t border-[#EAE9E2] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#777D75] block">
                Recent Scans
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {scanHistory.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-[#F7F5F0] text-[10px]"
                  >
                    <span className="font-mono text-[#20231F] truncate mr-2">{entry.ticketId}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      entry.status === 'VALID' ? 'text-[#169E65]' : 'text-amber-700'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
