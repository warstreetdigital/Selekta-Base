import React, { useState, useEffect } from 'react';
import { SelectaEvent, OrderItem, Order } from '../types';
import { useTicketContext } from '../context/TicketContext';
import { 
  X, 
  Minus, 
  Plus, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  User, 
  ArrowRight, 
  Ticket, 
  AlertCircle,
  ShieldCheck,
  Lock,
  CreditCard,
  Loader2,
  Check
} from 'lucide-react';

interface CheckoutModalProps {
  event: SelectaEvent | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ event, onClose }) => {
  const { 
    createOrder, 
    customerProfile, 
    formatPrice, 
    setActiveTab,
    currency
  } = useTicketContext();

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    if (!event || !event.ticketTiers[0]) return {};
    return { [event.ticketTiers[0].id]: 1 };
  });

  const [name, setName] = useState(customerProfile.name || '');
  const [phone, setPhone] = useState(customerProfile.phone || '+263 77 ');
  const [email, setEmail] = useState(customerProfile.email || '');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'ecocash' | 'card'>('ecocash');

  // Checkout flow steps
  const [step, setStep] = useState<'tickets' | 'details' | 'awaiting_payment' | 'success'>('tickets');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Awaiting prompt countdown timer
  const [awaitingSeconds, setAwaitingSeconds] = useState(3);

  // Keep contact details synced with customerProfile when loaded
  useEffect(() => {
    if (customerProfile.name && !name) setName(customerProfile.name);
    if (customerProfile.phone && (!phone || phone === '+263 77 ')) setPhone(customerProfile.phone);
    if (customerProfile.email && !email) setEmail(customerProfile.email);
  }, [customerProfile]);

  if (!event) return null;

  const selectedItems: OrderItem[] = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([tierId, qty]) => {
      const tier = event.ticketTiers.find(t => t.id === tierId)!;
      return {
        tierId,
        tierName: tier.name,
        unitPriceUSD: tier.priceUSD,
        quantity: qty
      };
    });

  const totalTickets = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUSD = selectedItems.reduce((sum, item) => sum + (item.unitPriceUSD * item.quantity), 0);
  const serviceFeeUSD = selectedItems.length > 0 ? 0.50 : 0;
  const totalUSD = subtotalUSD + serviceFeeUSD;

  const handleQuantityChange = (tierId: string, delta: number, max: number) => {
    const current = quantities[tierId] || 0;
    const next = Math.max(0, Math.min(max, current + delta));
    setQuantities(prev => ({
      ...prev,
      [tierId]: next
    }));
  };

  const handleProceedToDetails = () => {
    if (totalTickets === 0) {
      setErrorMsg('Please select at least 1 ticket to proceed.');
      return;
    }
    setErrorMsg(null);
    setStep('details');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter attendee full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('Please enter a valid Zimbabwean EcoCash phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email for ticket delivery.');
      return;
    }

    setErrorMsg(null);
    setStep('awaiting_payment');
    setAwaitingSeconds(3);

    // Simulate authentic mobile USSD push confirmation
    const timer = setTimeout(() => {
      const result = createOrder({
        eventId: event.id,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        items: selectedItems
      });

      if (result.success && result.order) {
        setCompletedOrder(result.order);
        setStep('success');
      } else {
        setErrorMsg(result.error || 'Failed to verify transaction.');
        setStep('details');
      }
    }, 2800);

    return () => clearTimeout(timer);
  };

  // Mask phone for confirmation screen
  const maskedPhone = () => {
    const clean = phone.trim();
    if (clean.length >= 8) {
      const prefix = clean.slice(0, Math.min(7, Math.floor(clean.length / 2)));
      const suffix = clean.slice(-2);
      return `${prefix} ••• ••${suffix}`;
    }
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#FAF9F5] border border-[#DDD6C8] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-[#E5DFD5] flex items-center justify-between bg-[#F4F1EA]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#20C982] uppercase tracking-wider block">
              {step === 'success' 
                ? 'Order Confirmed' 
                : step === 'awaiting_payment'
                  ? 'EcoCash Payment Verification'
                  : 'Official Checkout'
              }
            </span>
            <h3 className="font-extrabold text-[#20231F] text-sm truncate max-w-[270px]">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#DDD6C8] text-[#20231F] flex items-center justify-center hover:bg-[#EAE6DD] transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: TICKETS SELECTION */}
          {step === 'tickets' && (
            <div className="space-y-3.5">
              <div className="space-y-2">
                {event.ticketTiers.map(tier => {
                  const qty = quantities[tier.id] || 0;
                  return (
                    <div
                      key={tier.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        qty > 0 
                          ? 'bg-white border-[#20C982] shadow-2xs' 
                          : 'bg-[#FAF9F5] border-[#E5DFD5]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#20231F]">{tier.name}</span>
                            {tier.phaseLabel && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E8F9F2] text-[#128E5B]">
                                {tier.phaseLabel}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-black text-[#20231F] mt-0.5 block">
                            {formatPrice(tier.priceUSD)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD6C8] rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(tier.id, -1, tier.maxPerOrder)}
                            disabled={qty === 0}
                            className="w-6 h-6 rounded-full bg-white text-[#20231F] flex items-center justify-center disabled:opacity-30 hover:bg-[#EFECE6] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#20231F]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(tier.id, 1, tier.maxPerOrder)}
                            disabled={qty >= tier.maxPerOrder}
                            className="w-6 h-6 rounded-full bg-[#20C982] text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#169E65] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Calculation Summary */}
              <div className="p-3.5 rounded-2xl bg-[#F4F1EA] border border-[#E5DFD5] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6F776D]">
                  <span>Tickets ({totalTickets})</span>
                  <span className="font-semibold text-[#20231F]">{formatPrice(subtotalUSD)}</span>
                </div>
                <div className="flex justify-between text-[#6F776D]">
                  <span>EcoCash Gateway &amp; SMS Fee</span>
                  <span className="font-semibold text-[#20231F]">{formatPrice(serviceFeeUSD)}</span>
                </div>
                <div className="pt-2 border-t border-[#DDD6C8] flex justify-between font-black text-[#20231F] text-sm">
                  <span>Order Total ({currency})</span>
                  <span className="text-[#20C982] text-base">{formatPrice(totalUSD)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToDetails}
                disabled={totalTickets === 0}
                className="w-full py-3 px-4 rounded-xl bg-[#20C982] hover:bg-[#169E65] disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Select Payment Method</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD & ECOCASH DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              {/* Payment Methods Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F776D] block px-0.5">
                  Payment Method
                </label>

                {/* 1. Dedicated Official EcoCash Payment Card */}
                <div 
                  onClick={() => setPaymentMethod('ecocash')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    paymentMethod === 'ecocash'
                      ? 'bg-white border-[#20C982] ring-1 ring-[#20C982]/30 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5DFD5] hover:border-[#DDD6C8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Authentic EcoCash Brand Badge */}
                      <div className="w-10 h-10 rounded-xl bg-[#004B87] text-white flex items-center justify-center font-black text-xs tracking-tight shrink-0 shadow-2xs">
                        <span className="text-white font-black text-xs">Eco<span className="text-[#F7A800]">C</span></span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-[#004B87] tracking-tight">
                            Eco<span className="text-[#E69500]">Cash</span>
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#004B87]/10 text-[#004B87] tracking-wider uppercase">
                            Instant USSD
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6F776D]">
                          Pay securely via mobile push authorization
                        </p>
                      </div>
                    </div>

                    {/* Radio Checkmark */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                      paymentMethod === 'ecocash'
                        ? 'bg-[#20C982] text-white'
                        : 'border border-[#DDD6C8] bg-white'
                    }`}>
                      {paymentMethod === 'ecocash' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* 2. Secondary Card Method (Available for reference) */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-white border-[#20C982] ring-1 ring-[#20C982]/30 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5DFD5] hover:border-[#DDD6C8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EFECE6] border border-[#DDD6C8] text-[#20231F] flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-[#6F776D]" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#20231F]">
                            Visa / Mastercard / ZimSwitch
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6F776D]">
                          International cards or gate POS terminal
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                      paymentMethod === 'card'
                        ? 'bg-[#20C982] text-white'
                        : 'border border-[#DDD6C8] bg-white'
                    }`}>
                      {paymentMethod === 'card' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendee Contact Information */}
              <div className="space-y-3 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F776D] block px-0.5">
                  Attendee &amp; Mobile Money Details
                </label>

                {/* EcoCash Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#20231F] block">
                    EcoCash Registered Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3.5 top-2.5 text-[#004B87]" />
                    <input
                      type="tel"
                      required
                      placeholder="+263 77 123 4567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs font-mono font-bold text-[#20231F] focus:border-[#20C982] focus:outline-none transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-[#6F776D] block px-1">
                    Enter the phone number that will receive the EcoCash PIN prompt
                  </span>
                </div>

                {/* Attendee Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#20231F] block">
                    Full Name (Ticket Holder)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-2.5 text-[#6F776D]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tendai Moyo"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs text-[#20231F] focus:border-[#20C982] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#20231F] block">
                    Email Address (PDF Pass Delivery)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-[#6F776D]" />
                    <input
                      type="email"
                      required
                      placeholder="tendai@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs text-[#20231F] focus:border-[#20C982] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Security & PIN Disclaimer Banner */}
              <div className="p-3 rounded-2xl bg-[#E8F9F2] border border-[#20C982]/30 flex items-start gap-2.5 text-xs text-[#128E5B]">
                <ShieldCheck className="w-4 h-4 text-[#20C982] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">PIN Security Guarantee</span>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    A USSD prompt will appear on your phone. Authorize securely on your handset. Selekta Base will <strong>never</strong> ask for your EcoCash PIN.
                  </p>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 rounded-2xl bg-[#F4F1EA] border border-[#E5DFD5] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#6F776D] block">Amount to Authorize:</span>
                  <span className="text-[10px] text-[#6F776D] font-mono">{selectedItems.length} tier(s) • 1 order</span>
                </div>
                <span className="font-black text-lg text-[#20C982]">{formatPrice(totalUSD)}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('tickets')}
                  className="py-3 px-4 rounded-xl bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#20231F] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#20C982] hover:bg-[#169E65] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Pay with EcoCash ({formatPrice(totalUSD)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2.5: AWAITING ECOCASH PROMPT CONFIRMATION */}
          {step === 'awaiting_payment' && (
            <div className="space-y-5 py-3 text-center animate-fade-in">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#E8F9F2] text-[#20C982] flex items-center justify-center animate-pulse">
                  <Smartphone className="w-8 h-8 text-[#004B87]" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-[#20C982] border-t-transparent animate-spin" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#004B87] px-2 py-0.5 rounded-full bg-[#004B87]/10 inline-block">
                  Awaiting Handset Approval
                </span>
                <h4 className="font-black text-base text-[#20231F]">
                  Prompt Sent to {maskedPhone()}
                </h4>
                <p className="text-xs text-[#6F776D] max-w-xs mx-auto leading-relaxed">
                  Please check your phone screen right now and enter your confidential EcoCash PIN to authorize <strong className="text-[#20231F]">{formatPrice(totalUSD)}</strong>.
                </p>
              </div>

              {/* Step by step prompt instructions */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#E5DFD5] text-left text-xs space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#004B87] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-[#20231F]">Review Prompt on Mobile</span>
                    <p className="text-[11px] text-[#6F776D]">Look for the EcoCash USSD popup prompt on your device.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#004B87] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-[#20231F]">Enter PIN on Handset</span>
                    <p className="text-[11px] text-[#6F776D]">Confirm the payment securely using your secret EcoCash PIN.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#20C982] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-[#20231F]">Instant Pass Issuance</span>
                    <p className="text-[11px] text-[#6F776D]">Your encrypted offline QR passes will appear here automatically.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#6F776D]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#20C982]" />
                <span>Verifying gateway status...</span>
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-semibold text-[#6F776D] hover:text-[#20231F] underline cursor-pointer"
              >
                Change mobile number or cancel
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && completedOrder && (
            <div className="text-center space-y-4 py-2 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[#E8F9F2] text-[#20C982] mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-[#20C982]" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#128E5B] px-2 py-0.5 rounded-full bg-[#E8F9F2] inline-block">
                  Payment Verified • EcoCash Push
                </span>
                <h4 className="font-black text-lg text-[#20231F] mt-1">
                  Tickets Ready!
                </h4>
                <p className="text-xs text-[#6F776D]">
                  Booking Reference: <strong className="font-mono text-[#20231F]">{completedOrder.id}</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F1EA] border border-[#E5DFD5] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6F776D]">Event</span>
                  <span className="font-bold text-[#20231F] truncate max-w-[200px]">{completedOrder.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F776D]">Digital Passes</span>
                  <span className="font-black text-[#20C982]">{completedOrder.tickets.length} Offline Passes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F776D]">Attendee</span>
                  <span className="font-semibold text-[#20231F]">{completedOrder.customerName}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('tickets');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#20C982] hover:bg-[#169E65] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Passes in My Tickets</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#6F776D] text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
