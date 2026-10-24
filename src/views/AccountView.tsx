import React, { useState } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  User, 
  Search, 
  HelpCircle, 
  Download, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  QrCode,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Lock
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { 
    customerProfile, 
    setCustomerProfile, 
    currency, 
    setCurrency, 
    setIsRecoveryOpen, 
    resetAllDemoData,
    setIsScannerOpen,
    allTickets
  } = useTicketContext();

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(customerProfile.name || '');
  const [tempPhone, setTempPhone] = useState(customerProfile.phone || '');
  const [tempEmail, setTempEmail] = useState(customerProfile.email || '');
  const [profileNotification, setProfileNotification] = useState<string | null>(null);

  // Staff scanner authorization modal state
  const [isStaffAuthOpen, setIsStaffAuthOpen] = useState(false);
  const [staffPin, setStaffPin] = useState('');
  const [staffAuthError, setStaffAuthError] = useState<string | null>(null);

  // Reset confirmation modal state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Helper to mask sensitive phone number (e.g. +263 77 ••• ••12)
  const getMaskedPhone = (phoneStr: string) => {
    if (!phoneStr || phoneStr.trim().length < 5) return 'No number linked';
    const clean = phoneStr.trim();
    // Preserve prefix and last 2-3 digits
    if (clean.startsWith('+263')) {
      const remaining = clean.slice(4).trim();
      const code = remaining.slice(0, 2); // e.g. "77"
      const lastDigits = remaining.slice(-2);
      return `+263 ${code} ••• ••${lastDigits}`;
    }
    const visibleStart = clean.slice(0, 3);
    const visibleEnd = clean.slice(-2);
    return `${visibleStart} ••• ••${visibleEnd}`;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerProfile({
      name: tempName.trim(),
      phone: tempPhone.trim(),
      email: tempEmail.trim(),
      preferredCurrency: currency
    });
    setIsEditingProfile(false);
    setProfileNotification('Contact details updated successfully');
    setTimeout(() => setProfileNotification(null), 3000);
  };

  const handleVerifyStaffPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized gate staff PIN: 1234 or demo mode
    if (staffPin.trim() === '1234' || staffPin.trim() === 'gate' || staffPin.trim() === '') {
      setIsStaffAuthOpen(false);
      setStaffPin('');
      setStaffAuthError(null);
      setIsScannerOpen(true);
    } else {
      setStaffAuthError('Invalid Staff PIN. Authorized personnel only.');
    }
  };

  const handleConfirmReset = () => {
    resetAllDemoData();
    setIsResetConfirmOpen(false);
    setProfileNotification('Demo orders and test data reset to default.');
    setTimeout(() => setProfileNotification(null), 3000);
  };

  const faqs = [
    {
      q: 'How does merchant EcoCash payment work?',
      a: 'During checkout, enter your registered Zimbabwean EcoCash mobile number. A direct USSD merchant prompt is sent to your handset. Review the total and authorize by entering your EcoCash PIN on your phone. Selekta Base never handles or requests your PIN. Once verified, your encrypted QR digital passes are issued immediately.'
    },
    {
      q: 'Will my tickets work without internet at the venue?',
      a: 'Yes. Selekta Base is a full Progressive Web App (PWA). All purchased passes are cryptographically stored on your device and cached offline. At the gate, open My Tickets to display high-contrast QR passes without requiring mobile data or cellular coverage.'
    },
    {
      q: 'How do I recover tickets purchased as a guest?',
      a: 'Use the "Recover a booking" tool in Ticket Assistance. Enter your unique Booking Reference (e.g. SB-8921-HRE) or the EcoCash phone number used during checkout to restore all passes to this device.'
    },
    {
      q: 'Can I bring a coolerbox to Selekta Base events?',
      a: 'Coolerbox allowances vary by event (such as BlowOut Festival). When permitted, an official Coolerbox Pass must be added to your order. Strict safety policies apply at all Zimbabwean venues: strictly NO glass bottles or dangerous items are permitted.'
    },
    {
      q: 'What is the refund and event cancellation policy?',
      a: 'Tickets are non-refundable once purchased, except in the event of an official postponement or full cancellation by the event organizer. Digital passes may be transferred or presented by any attendee in your party.'
    }
  ];

  return (
    <div className="max-w-md mx-auto space-y-5 pb-28 animate-fade-in pt-2 px-1">
      {/* 1. Page Header */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-black text-[#20231F] tracking-tight">
          Account &amp; Settings
        </h2>
        <p className="text-xs text-[#6F776D] font-normal">
          Manage your details and preferences
        </p>
      </div>

      {/* Floating Notification */}
      {profileNotification && (
        <div className="p-3 rounded-xl bg-[#E8F9F2] border border-[#20C982]/30 text-[#128E5B] text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#20C982] shrink-0" />
            <span>{profileNotification}</span>
          </div>
          <button 
            onClick={() => setProfileNotification(null)}
            className="text-[#128E5B] hover:text-[#20231F]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Section: Guest Profile */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-[#6F776D] uppercase tracking-wider">
            Guest Profile
          </h3>
          {!isEditingProfile && (
            <button
              onClick={() => {
                setTempName(customerProfile.name || '');
                setTempPhone(customerProfile.phone || '');
                setTempEmail(customerProfile.email || '');
                setIsEditingProfile(true);
              }}
              className="text-xs font-bold text-[#20C982] hover:text-[#169E65] transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        <div className="bg-[#FAF9F5] rounded-2xl border border-[#E5DFD5] p-4 shadow-2xs">
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F776D] block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tendai Moyo"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs text-[#20231F] focus:outline-none focus:border-[#20C982] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F776D] block">
                  EcoCash Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+263 77 000 0000"
                  value={tempPhone}
                  onChange={e => setTempPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs font-mono text-[#20231F] focus:outline-none focus:border-[#20C982] transition-colors"
                />
                <span className="text-[10px] text-[#6F776D] block">
                  Used for instant merchant push authorization
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F776D] block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="tendai@gmail.com"
                  value={tempEmail}
                  onChange={e => setTempEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs text-[#20231F] focus:outline-none focus:border-[#20C982] transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#20231F] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#20C982] hover:bg-[#169E65] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-3.5">
              {/* Restrained Profile Icon */}
              <div className="w-11 h-11 rounded-full bg-[#EFECE6] border border-[#DDD6C8] text-[#20231F] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#20C982]" />
              </div>

              {/* Profile Details with Masked EcoCash */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="font-extrabold text-sm text-[#20231F] truncate">
                  {customerProfile.name || 'Guest Attendee'}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[#20231F] text-[11px] font-semibold">
                    {getMaskedPhone(customerProfile.phone)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E8F9F2] text-[#128E5B] font-bold uppercase">
                    EcoCash
                  </span>
                </div>
                <p className="text-[11px] text-[#6F776D] truncate">
                  {customerProfile.email || 'No email registered'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Section: Ticket Assistance */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#6F776D] uppercase tracking-wider px-0.5">
          Ticket Assistance
        </h3>

        <div className="bg-[#FAF9F5] rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-2xs divide-y divide-[#E5DFD5]">
          {/* Recover a booking */}
          <button
            onClick={() => setIsRecoveryOpen(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F4F1EA] transition-colors cursor-pointer group"
          >
            <div className="space-y-0.5 pr-2">
              <h4 className="font-bold text-xs text-[#20231F] group-hover:text-[#20C982] transition-colors">
                Recover a booking
              </h4>
              <p className="text-[11px] text-[#6F776D]">
                Look up and restore tickets using your booking reference
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#EFECE6] group-hover:bg-[#20C982] group-hover:text-white text-[#20231F] flex items-center justify-center transition-colors shrink-0">
              <Search className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Gate Staff Scanner (Restricted Access) */}
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-[#20231F]">
                  Gate Staff Scanner
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#EFECE6] text-[#6F776D] uppercase">
                  Staff Only
                </span>
              </div>
              <p className="text-[11px] text-[#6F776D]">
                Accredited marshal entrance verification and QR check-in
              </p>
            </div>
            <button
              onClick={() => setIsStaffAuthOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD6C8] hover:border-[#20C982] text-xs font-semibold text-[#20231F] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
            >
              <Lock className="w-3 h-3 text-[#20C982]" />
              <span>Verify</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Section: Preferences & App */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#6F776D] uppercase tracking-wider px-0.5">
          Preferences &amp; App
        </h3>

        <div className="bg-[#FAF9F5] rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-2xs divide-y divide-[#E5DFD5]">
          {/* Display currency segmented control */}
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <h4 className="font-bold text-xs text-[#20231F]">
                Display Currency
              </h4>
              <p className="text-[11px] text-[#6F776D]">
                Choose pricing in US Dollars or Zimbabwe Gold
              </p>
            </div>

            {/* Compact USD / ZiG Segmented Control */}
            <div className="flex p-0.5 rounded-xl bg-[#EFECE6] border border-[#DDD6C8] shrink-0">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-[#20231F] text-white shadow-2xs'
                    : 'text-[#6F776D] hover:text-[#20231F]'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('ZiG')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'ZiG'
                    ? 'bg-[#20231F] text-white shadow-2xs'
                    : 'text-[#6F776D] hover:text-[#20231F]'
                }`}
              >
                ZiG
              </button>
            </div>
          </div>

          {/* Offline ticket storage status */}
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <h4 className="font-bold text-xs text-[#20231F]">
                Offline Ticket Storage
              </h4>
              <p className="text-[11px] text-[#6F776D]">
                {allTickets.length > 0 
                  ? `${allTickets.length} digital passes cached for offline presentation`
                  : 'Pass vault active • Ready for gate presentation'
                }
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F9F2] text-[#128E5B] border border-[#20C982]/25 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20C982] animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wide">Active</span>
            </div>
          </div>

          {/* Optional PWA Install Action */}
          {isInstallable && !isInstalled && (
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <h4 className="font-bold text-xs text-[#20231F]">
                  Install Selekta Base
                </h4>
                <p className="text-[11px] text-[#6F776D]">
                  Add to home screen for instant offline launch
                </p>
              </div>
              <button
                onClick={install}
                className="px-3.5 py-1.5 rounded-xl bg-[#20C982] hover:bg-[#169E65] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            </div>
          )}

          {/* Reset Test Data (Protected with Confirmation) */}
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <h4 className="font-bold text-xs text-[#20231F]">
                Reset Demo Data
              </h4>
              <p className="text-[11px] text-[#6F776D]">
                Restore sample bookings and tickets to initial state
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD6C8] hover:border-red-300 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* 5. Section: Help & Policies */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#6F776D] uppercase tracking-wider px-0.5">
          Help &amp; Policies
        </h3>

        <div className="bg-[#FAF9F5] rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-2xs divide-y divide-[#E5DFD5]">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  <span className="font-bold text-xs text-[#20231F] leading-snug">
                    {faq.q}
                  </span>
                  <div className="shrink-0 text-[#6F776D]">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#20C982]" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-xs text-[#6F776D] leading-relaxed border-t border-[#E5DFD5]/40 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="text-center pt-2 space-y-1 text-[11px] text-[#6F776D]">
        <p className="font-bold tracking-wider uppercase text-[#20231F]/80">
          SELEKTA BASE ZIMBABWE • OFFICIAL TICKETING PLATFORM
        </p>
        <p>
          Support assistance: <a href="mailto:tickets@selektabase.co.zw" className="text-[#20C982] hover:underline font-medium">tickets@selektabase.co.zw</a>
        </p>
      </footer>

      {/* MODAL: Gate Staff Scanner Authorization */}
      {isStaffAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-sm bg-[#FAF9F5] rounded-3xl border border-[#DDD6C8] p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#E5DFD5]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EFECE6] text-[#20231F] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[#20C982]" />
                </div>
                <h4 className="font-extrabold text-sm text-[#20231F]">
                  Staff Scanner Access
                </h4>
              </div>
              <button
                onClick={() => {
                  setIsStaffAuthOpen(false);
                  setStaffAuthError(null);
                }}
                className="w-7 h-7 rounded-full bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#20231F] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#6F776D] leading-relaxed">
              This entrance terminal is reserved for accredited gate marshals. Please enter the authorized staff PIN to launch camera scanning.
            </p>

            {staffAuthError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {staffAuthError}
              </div>
            )}

            <form onSubmit={handleVerifyStaffPin} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F776D] block mb-1">
                  Staff Passcode (Demo: 1234)
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter PIN"
                  value={staffPin}
                  onChange={e => setStaffPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-center font-mono text-base tracking-widest text-[#20231F] focus:outline-none focus:border-[#20C982]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsStaffAuthOpen(false);
                    setStaffAuthError(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#20231F] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#20C982] hover:bg-[#169E65] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Authorize
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsStaffAuthOpen(false);
                  setIsScannerOpen(true);
                }}
                className="w-full text-center text-[11px] font-medium text-[#20C982] hover:underline pt-1 cursor-pointer"
              >
                Launch in Staff Demo Mode
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Demo Data Confirmation */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-sm bg-[#FAF9F5] rounded-3xl border border-[#DDD6C8] p-5 shadow-2xl space-y-3.5"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-sm text-[#20231F]">
                Reset Demo Data?
              </h4>
              <p className="text-xs text-[#6F776D] leading-relaxed">
                This will restore initial sample tickets, clear locally placed test orders, and reset sample contact details. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#20231F] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
