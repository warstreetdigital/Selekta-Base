import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  SelectaEvent, 
  Order, 
  DigitalTicket, 
  CustomerProfile, 
  TicketEntryStatus,
  OrderItem 
} from '../types';
import { MOCK_EVENTS, INITIAL_SAMPLE_ORDERS, ZIM_EXCHANGE_RATE_ZIG } from '../data/mockEvents';

export type NavTab = 'home' | 'explore' | 'tickets' | 'account';

interface TicketContextType {
  events: SelectaEvent[];
  selectedEvent: SelectaEvent | null;
  setSelectedEvent: (event: SelectaEvent | null) => void;
  checkoutEvent: SelectaEvent | null;
  setCheckoutEvent: (event: SelectaEvent | null) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  orders: Order[];
  allTickets: DigitalTicket[];
  customerProfile: CustomerProfile;
  setCustomerProfile: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  currency: 'USD' | 'ZiG';
  setCurrency: (cur: 'USD' | 'ZiG') => void;
  formatPrice: (amountUSD: number) => string;
  createOrder: (orderData: {
    eventId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: OrderItem[];
  }) => { success: boolean; order?: Order; error?: string };
  checkInTicket: (ticketId: string, gateName?: string) => { 
    status: 'VALID' | 'ALREADY_USED' | 'NOT_FOUND' | 'REVOKED'; 
    ticket?: DigitalTicket; 
    message: string;
  };
  recoverBooking: (reference: string, contact: string) => {
    success: boolean;
    order?: Order;
    message: string;
  };
  resetAllDemoData: () => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isRecoveryOpen: boolean;
  setIsRecoveryOpen: (open: boolean) => void;
  activeStoryId: string | null;
  setActiveStoryId: (id: string | null) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const STORAGE_KEY_ORDERS = 'selectabase_orders_v1';
const STORAGE_KEY_PROFILE = 'selectabase_profile_v1';
const STORAGE_KEY_CURRENCY = 'selectabase_currency_v1';

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events] = useState<SelectaEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<SelectaEvent | null>(null);
  const [checkoutEvent, setCheckoutEvent] = useState<SelectaEvent | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  // Initialize currency from localStorage
  const [currency, setCurrencyState] = useState<'USD' | 'ZiG'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
      return (saved === 'ZiG' || saved === 'USD') ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const setCurrency = (cur: 'USD' | 'ZiG') => {
    setCurrencyState(cur);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, cur);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  };

  // Initialize customer profile
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse customer profile', e);
    }
    return {
      name: 'Tendai Moyo',
      phone: '+263 77 245 9012',
      email: 'tendai.moyo@gmail.com',
      preferredCurrency: 'USD'
    };
  });

  // Save profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(customerProfile));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
  }, [customerProfile]);

  // Initialize orders (seeded with sample initial orders if empty)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored orders', e);
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  // Save orders changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  }, [orders]);

  // Derived flat tickets list from all orders
  const allTickets = useMemo(() => {
    return orders.flatMap(order => order.tickets);
  }, [orders]);

  // Currency formatting helper
  const formatPrice = (amountUSD: number): string => {
    if (currency === 'ZiG') {
      const zigAmount = (amountUSD * ZIM_EXCHANGE_RATE_ZIG).toFixed(0);
      return `ZiG ${Number(zigAmount).toLocaleString()}`;
    }
    return `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`;
  };

  // Create order with server-like validation and ticket generation
  const createOrder = (orderData: {
    eventId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: OrderItem[];
  }) => {
    const event = events.find(e => e.id === orderData.eventId);
    if (!event) {
      return { success: false, error: 'Event not found.' };
    }

    if (!orderData.items || orderData.items.length === 0) {
      return { success: false, error: 'Please select at least one ticket.' };
    }

    // Calculate subtotal
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPriceUSD * item.quantity), 0);
    const serviceFee = 0.50; // Nominal platform processing fee
    const total = subtotal + serviceFee;

    // Generate unique random reference: e.g. SB-48219-HRE
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const cityCode = event.city === 'Harare' ? 'HRE' : event.city === 'Bulawayo' ? 'BYO' : 'VFA';
    const orderId = `SB-${randNum}-${cityCode}`;
    const timestamp = new Date().toISOString();

    // Generate individual tickets for each seat/category
    const issuedTickets: DigitalTicket[] = [];
    let ticketCounter = 1;

    for (const item of orderData.items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticketId = `TKT-${orderId.replace('SB-', '')}-${String(ticketCounter).padStart(2, '0')}`;
        const holderName = i === 0 
          ? orderData.customerName 
          : `${orderData.customerName} (Guest ${i + 1})`;
        
        // Cryptographic-style tamper-resistant payload string
        const hashSeed = Math.random().toString(36).substring(2, 10);
        const qrPayload = `SELEKTA_BASE:VALID:${ticketId}:${orderId}:${event.id}:SIG_${hashSeed}`;
        const shareableToken = `sb-pass-${ticketId.toLowerCase()}-${hashSeed}`;

        issuedTickets.push({
          ticketId,
          orderReference: orderId,
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.startDate,
          eventVenue: `${event.venueName}, ${event.city}`,
          tierId: item.tierId,
          tierName: item.tierName,
          holderName,
          entryStatus: 'VALID',
          qrPayload,
          shareableToken,
          priceUSD: item.unitPriceUSD
        });
        ticketCounter++;
      }
    }

    const newOrder: Order = {
      id: orderId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventVenue: `${event.venueName}, ${event.city}`,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      subtotalUSD: subtotal,
      serviceFeeUSD: serviceFee,
      totalUSD: total,
      currency: 'USD',
      paymentMethod: 'ecocash_merchant',
      paymentStatus: 'verified', // In Phase 1 sandbox simulation
      paymentReference: `ECO-MERCH-ZW-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: timestamp,
      tickets: issuedTickets
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update customer profile for convenience
    setCustomerProfile(prev => ({
      ...prev,
      name: orderData.customerName,
      phone: orderData.customerPhone,
      email: orderData.customerEmail
    }));

    return { success: true, order: newOrder };
  };

  // Check-in validation for Gate staff scanner
  const checkInTicket = (rawTicketInput: string, gateName = 'Main Entrance Gate 1') => {
    // rawTicketInput can be a ticketId or a QR payload string
    let ticketId = rawTicketInput.trim();
    if (ticketId.includes('SELEKTA_BASE:') || ticketId.includes('SELECTA_BASE:')) {
      const parts = ticketId.split(':');
      if (parts[2]) {
        ticketId = parts[2];
      }
    }

    // Search across orders
    let targetTicket: DigitalTicket | undefined;
    let targetOrderIndex = -1;
    let targetTicketIndex = -1;

    for (let oIdx = 0; oIdx < orders.length; oIdx++) {
      const tIdx = orders[oIdx].tickets.findIndex(t => 
        t.ticketId.toUpperCase() === ticketId.toUpperCase() ||
        t.qrPayload === rawTicketInput
      );
      if (tIdx !== -1) {
        targetTicket = orders[oIdx].tickets[tIdx];
        targetOrderIndex = oIdx;
        targetTicketIndex = tIdx;
        break;
      }
    }

    if (!targetTicket) {
      return {
        status: 'NOT_FOUND' as const,
        message: `Ticket "${ticketId}" not found in Selekta Base directory. Check spelling or verify with ticketing supervisor.`
      };
    }

    if (targetTicket.entryStatus === 'CHECKED_IN') {
      return {
        status: 'ALREADY_USED' as const,
        ticket: targetTicket,
        message: `DUPLICATE ENTRY ALERT: This ticket was already checked in at ${targetTicket.checkInGate || 'Gate'} on ${new Date(targetTicket.checkInTimestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      };
    }

    if (targetTicket.entryStatus === 'REVOKED') {
      return {
        status: 'REVOKED' as const,
        ticket: targetTicket,
        message: 'This ticket has been cancelled or refunded.'
      };
    }

    // Atomic entry check-in
    const updatedTicket: DigitalTicket = {
      ...targetTicket,
      entryStatus: 'CHECKED_IN',
      checkInTimestamp: new Date().toISOString(),
      checkInGate: gateName
    };

    const updatedOrders = [...orders];
    updatedOrders[targetOrderIndex] = {
      ...updatedOrders[targetOrderIndex],
      tickets: updatedOrders[targetOrderIndex].tickets.map((t, idx) => 
        idx === targetTicketIndex ? updatedTicket : t
      )
    };

    setOrders(updatedOrders);

    return {
      status: 'VALID' as const,
      ticket: updatedTicket,
      message: `PASS VERIFIED: ${targetTicket.holderName} — ${targetTicket.tierName}. Admitted at ${gateName}.`
    };
  };

  // Guest booking recovery
  const recoverBooking = (reference: string, contact: string) => {
    const cleanRef = reference.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase().replace(/\s+/g, '');

    // Search in existing orders
    const matched = orders.find(order => {
      const refMatch = order.id.toUpperCase() === cleanRef;
      const emailMatch = order.customerEmail.toLowerCase().trim() === cleanContact;
      const phoneMatch = order.customerPhone.replace(/\s+/g, '').includes(cleanContact.replace(/[^0-9]/g, ''));
      return refMatch && (emailMatch || phoneMatch);
    });

    if (matched) {
      return {
        success: true,
        order: matched,
        message: `Booking ${matched.id} found! ${matched.tickets.length} tickets loaded to your device.`
      };
    }

    // If not in local list, check if it matches the initial sample booking
    const sampleMatch = INITIAL_SAMPLE_ORDERS.find(o => o.id.toUpperCase() === cleanRef);
    if (sampleMatch) {
      // Re-inject sample booking
      setOrders(prev => [sampleMatch, ...prev]);
      return {
        success: true,
        order: sampleMatch,
        message: `Booking ${sampleMatch.id} restored to your wallet.`
      };
    }

    return {
      success: false,
      message: 'No matching booking found. Please verify your Booking Reference (e.g. SB-8921-HRE) and registered phone or email.'
    };
  };

  const resetAllDemoData = () => {
    setOrders(INITIAL_SAMPLE_ORDERS);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
  };

  return (
    <TicketContext.Provider
      value={{
        events,
        selectedEvent,
        setSelectedEvent,
        checkoutEvent,
        setCheckoutEvent,
        activeTab,
        setActiveTab,
        orders,
        allTickets,
        customerProfile,
        setCustomerProfile,
        currency,
        setCurrency,
        formatPrice,
        createOrder,
        checkInTicket,
        recoverBooking,
        resetAllDemoData,
        isScannerOpen,
        setIsScannerOpen,
        isRecoveryOpen,
        setIsRecoveryOpen,
        activeStoryId,
        setActiveStoryId,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
};
