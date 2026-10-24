// Selekta Base - Core Domain Models & Types

export type EventCategory = 
  | 'festivals'
  | 'nightlife'
  | 'music'
  | 'arts'
  | 'food_drinks'
  | 'lifestyle';

export type EventStatus = 
  | 'on_sale'
  | 'almost_sold_out'
  | 'sold_out'
  | 'sales_closed'
  | 'postponed';

export interface TicketTier {
  id: string;
  name: string; // e.g. "Early Bird", "Phase 1", "VIP Pass", "Coolerbox Pass"
  description?: string;
  priceUSD: number;
  availableQuantity: number;
  totalQuantity: number;
  salesCloseDate?: string;
  maxPerOrder: number;
  phaseLabel?: string; // "Phase 1 of 3", "Tier 2", etc.
  perks?: string[];
}

export interface EventPolicy {
  ageRestriction: string; // "18+ Only" | "All Ages" | "Family Friendly"
  coolerboxAllowed: boolean;
  coolerboxDetails?: string;
  refundPolicy: string;
  gateRules: string[];
}

export interface OrganizerInfo {
  name: string;
  isVerified: boolean;
  contactEmail: string;
  contactPhone?: string;
  about?: string;
}

export interface SelectaEvent {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  posterUrl: string;
  heroUrl?: string;
  category: EventCategory;
  city: 'Harare' | 'Bulawayo' | 'Victoria Falls' | 'Mutare';
  venueName: string;
  venueAddress: string;
  startDate: string; // ISO date string e.g. "2026-11-14T16:00:00Z"
  endDate: string;
  status: EventStatus;
  isFeatured?: boolean;
  isSelectaBaseOriginal?: boolean;
  hasVideoPreview?: boolean;
  videoUrl?: string;
  startingPriceUSD: number;
  ticketTiers: TicketTier[];
  policies: EventPolicy;
  organizer: OrganizerInfo;
}

export interface OrderItem {
  tierId: string;
  tierName: string;
  unitPriceUSD: number;
  quantity: number;
}

export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface Order {
  id: string; // Unique order reference e.g. "SB-89201-HRE"
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string; // EcoCash number
  items: OrderItem[];
  subtotalUSD: number;
  serviceFeeUSD: number;
  totalUSD: number;
  currency: 'USD' | 'ZiG';
  paymentMethod: 'ecocash_merchant';
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  createdAt: string;
  tickets: DigitalTicket[];
}

export type TicketEntryStatus = 'VALID' | 'CHECKED_IN' | 'REVOKED' | 'EXPIRED';

export interface DigitalTicket {
  ticketId: string; // Unique unpredictable string e.g. "TKT-9F3A-84C1"
  orderReference: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  tierId: string;
  tierName: string;
  holderName: string;
  entryStatus: TicketEntryStatus;
  checkInTimestamp?: string;
  checkInGate?: string;
  qrPayload: string; // Encrypted / signed signature string
  shareableToken: string;
  priceUSD: number;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  preferredCurrency: 'USD' | 'ZiG';
}

export interface StorySlide {
  id: string;
  imageUrl: string;
  caption: string;
  dateLabel: string;
  tagline?: string;
  isVideo?: boolean;
  videoUrl?: string;
  posterUrl?: string;
}

export interface EventStory {
  id: string;
  title: string;
  isPastArchive: boolean;
  statusLabel?: string;
  isHighlighted?: boolean;
  hasVideo?: boolean;
  coverImage: string;
  dateTag: string;
  location: string;
  slides: StorySlide[];
}
