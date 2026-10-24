import { SelectaEvent, EventStory } from '../types';

export const ZIM_EXCHANGE_RATE_ZIG = 26.5; // 1 USD = 26.5 ZiG approx for display reference

// Official Selekta Base Branded SVG Placeholder (used gracefully if an image fails to load or for unphotographed sessions)
export const SELECTA_BASE_BRAND_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="800" height="500" fill="#EAE5DB"/>
  <rect x="24" y="24" width="752" height="452" rx="16" fill="#DFDAD0" stroke="#DCD6CB" stroke-width="2"/>
  <circle cx="400" cy="200" r="54" fill="#20C982" opacity="0.15"/>
  <circle cx="400" cy="200" r="38" fill="#20C982"/>
  <text x="400" y="210" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF" text-anchor="middle">SB</text>
  <text x="400" y="285" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="900" fill="#20231F" text-anchor="middle" letter-spacing="3">SELEKTA BASE</text>
  <text x="400" y="315" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#6F776D" text-anchor="middle" letter-spacing="1.5">OFFICIAL EVENT ARCHIVE • ZIMBABWE</text>
  <line x1="320" y1="335" x2="480" y2="335" stroke="#20C982" stroke-width="2" stroke-linecap="round"/>
</svg>
`)}`;
export const SELEKTA_BASE_BRAND_POSTER = SELECTA_BASE_BRAND_POSTER;

// Official documented Selekta Base Event Stories using genuine media library assets
export const OFFICIAL_STORIES: EventStory[] = [
  {
    id: 'story-colour-run-2026',
    title: 'Colourfest',
    isPastArchive: false,
    isHighlighted: true, // Thin, elegant animated green glow
    hasVideo: true,
    statusLabel: 'COMING SOON',
    dateTag: 'Sun 6 Dec 2026 • 7 AM',
    location: 'Borrowdale Racecourse, Harare',
    coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
    slides: [
      {
        id: 'cr-vid-1',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
        posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
        isVideo: true,
        videoUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Video%20colourfest%20preview.mp4',
        caption: 'Official video preview of the Grand Colour Run & Colourfest family fun day returning to Borrowdale Racecourse on 6 December 2026.',
        dateLabel: 'Official Video Preview',
        tagline: 'Colourfest 2026 Live Experience'
      },
      {
        id: 'cr-poster-2',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
        caption: 'Official Grand Colour Run Family Fun Day poster: 5KM untimed celebration of family, wellness and synchronized color powder explosions.',
        dateLabel: '6 Dec 2026 • 7:00 AM - 3:00 PM',
        tagline: 'Selekta Base x Hype Nation Official Presentation'
      },
      {
        id: 'cr-fest-3',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colourfest.jpg',
        caption: 'Colourfest memories: vibrant powdered pigments, live mainstage concert, kids adventure play zones, and artisan fresh food courts.',
        dateLabel: 'Borrowdale Racecourse Lawns',
        tagline: 'Family Friendly • All Fitness Levels Welcome'
      },
      {
        id: 'cr-flash-4',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorfest.jpg',
        caption: 'The synchronized color cloud countdown uniting thousands of runners, dancers, and families under Harare skies.',
        dateLabel: 'Official Flashback',
        tagline: 'Harare Color Explosion'
      }
    ]
  },
  {
    id: 'story-blowout-october',
    title: 'Oct BlowOut',
    isPastArchive: true,
    isHighlighted: false,
    statusLabel: 'ARCHIVE',
    dateTag: 'October Edition Archive',
    location: 'Borrowdale Racecourse, Harare',
    coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octoberblowout.jpg',
    slides: [
      {
        id: 'bo-oct-1',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octoberblowout.jpg',
        caption: 'Official October Blowout artwork: Harare’s premier precision spinning arena, twin outdoor sound walls, and high-octane automotive showcase.',
        dateLabel: 'October Blowout Edition',
        tagline: 'Official October Artwork'
      },
      {
        id: 'bo-oct-2',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octo%20blowours.jpg',
        caption: 'October Blowout crowd flashbacks: Harare’s urban youth culture, precision motorsport, and massive outdoor sound clash.',
        dateLabel: 'Borrowdale Racecourse Arena',
        tagline: 'October Blowout Flashback'
      }
    ]
  },
  {
    id: 'story-blowout-fest',
    title: 'BlowOut Fest',
    isPastArchive: true,
    isHighlighted: false,
    statusLabel: 'FESTIVAL',
    dateTag: 'Official Festival Archive',
    location: 'Borrowdale Racecourse, Harare',
    coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowout.jpg',
    slides: [
      {
        id: 'bo-fest-1',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowout.jpg',
        caption: 'The landmark Selekta Base BlowOut Festival: Harare’s undisputed home of car culture, tire-smoking wheel spins, and urban music soundstages.',
        dateLabel: 'BlowOut Festival Official',
        tagline: 'The Main Stage & Arena'
      },
      {
        id: 'bo-fest-2',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouts.jpg',
        caption: 'Festival arena energy: roaring engines, crowd roar, and top precision drivers pushing vehicles to their limits.',
        dateLabel: 'Festival Archive',
        tagline: 'The Sound & The Smoke'
      }
    ]
  },
  {
    id: 'story-blowout-vault',
    title: '10-Yr Vault',
    isPastArchive: true,
    isHighlighted: false,
    statusLabel: '10TH ANNIV',
    dateTag: '10 Year Milestone Archive',
    location: 'Harare, Zimbabwe',
    coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouut.jpg',
    slides: [
      {
        id: 'bo-vault-1',
        imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouut.jpg',
        caption: 'Celebrating over a decade of Selekta Base culture: founded in 2015 by Arnold Tinashe Chigwerewe, building Zimbabwe’s premier outdoor festival institution.',
        dateLabel: '10 Years of Selekta Base',
        tagline: 'Founded 2015 • Harare Heritage'
      }
    ]
  }
];

// Official Selekta Base Event Listings using authentic media library artwork
export const MOCK_EVENTS: SelectaEvent[] = [
  {
    id: 'evt-colour-run-2026',
    title: 'Grand Colour Run Family Fun Day 2026',
    slug: 'grand-colour-run-family-fun-day-2026',
    tagline: '5KM color fun walk & festival with live sound, family zones & craft food',
    description: 'Harare’s most anticipated family wellness and open-air celebration returns to Borrowdale Racecourse on Sunday, 6 December 2026. Designed for all fitness levels, participants walk, jog, or dance through 5 distinct color powder zones along an untimed 5KM route. The day concludes in a massive synchronized color explosion at midday, featuring live stage performances, kids water play zones, and curated artisan food stalls.',
    posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
    heroUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colourfest.jpg',
    hasVideoPreview: true,
    videoUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Video%20colourfest%20preview.mp4',
    category: 'festivals',
    city: 'Harare',
    venueName: 'Borrowdale Racecourse',
    venueAddress: 'Borrowdale Road, Harare',
    startDate: '2026-12-06T07:00:00Z',
    endDate: '2026-12-06T15:00:00Z',
    status: 'on_sale',
    isFeatured: true,
    isSelectaBaseOriginal: true,
    startingPriceUSD: 5,
    ticketTiers: [
      {
        id: 'tier-cr-indiv',
        name: 'Individual Runner Pass',
        description: 'Includes 1 official color packet and full festival arena access.',
        priceUSD: 5,
        availableQuantity: 450,
        totalQuantity: 600,
        phaseLabel: 'Early Pass',
        maxPerOrder: 6,
        perks: ['1 Color Powder Packet', 'Full Event Access', 'Main Stage Concert']
      },
      {
        id: 'tier-cr-family',
        name: 'Family / Crew Pack (4 Pax)',
        description: 'Admission for 4 attendees + 4 color packets.',
        priceUSD: 18,
        availableQuantity: 95,
        totalQuantity: 150,
        phaseLabel: 'Group Discount',
        maxPerOrder: 2,
        perks: ['Admits 4 People', '4 Color Packets', 'Kids Zone Access']
      },
      {
        id: 'tier-cr-vip',
        name: 'VIP Deck & Color Kit',
        description: 'Covered raised deck, complimentary drinks voucher, and deluxe color kit.',
        priceUSD: 20,
        availableQuantity: 40,
        totalQuantity: 80,
        phaseLabel: 'VIP Deck',
        maxPerOrder: 4,
        perks: ['Covered VIP Pavilion', 'Deluxe Color Cannon Kit', 'Refreshment Voucher']
      }
    ],
    policies: {
      ageRestriction: 'All Ages • Family Friendly',
      coolerboxAllowed: false,
      coolerboxDetails: 'Full food village and refreshment bars available on-site.',
      refundPolicy: 'Non-refundable except in case of event postponement.',
      gateRules: [
        'Gates open at 07:00 AM. Run flag-off at 08:30 AM.',
        'White shirts recommended for maximum color vibrancy.',
        'Present QR code directly on mobile phone for rapid scanning.'
      ]
    },
    organizer: {
      name: 'Selekta Base & Hype Nation',
      isVerified: true,
      contactEmail: 'tickets@selektabase.co.zw',
      contactPhone: '+263 77 100 2400',
      about: 'Official collaboration between Selekta Base and Hype Nation.'
    }
  },
  {
    id: 'evt-october-blowout-2026',
    title: 'Selekta Base October BlowOut',
    slug: 'selekta-base-october-blowout',
    tagline: 'Harare’s paramount sound clash, spinning arena and urban lifestyle celebration',
    description: 'The signature Selekta Base October BlowOut unites Zimbabwe’s leading car culture clubs, precision spinning drivers, and premier urban sound selectors at Borrowdale Racecourse. Experience screeching tires, smoke plumes, outdoor food stalls, and high-energy music.',
    posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octoberblowout.jpg',
    heroUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octo%20blowours.jpg',
    category: 'festivals',
    city: 'Harare',
    venueName: 'Borrowdale Racecourse Grounds',
    venueAddress: 'Borrowdale Road, Harare',
    startDate: '2026-10-31T12:00:00Z',
    endDate: '2026-11-01T02:00:00Z',
    status: 'on_sale',
    isFeatured: true,
    isSelectaBaseOriginal: true,
    startingPriceUSD: 15,
    ticketTiers: [
      {
        id: 'tier-oct-eb',
        name: 'Phase 1 Early Bird',
        description: 'Standard festival entry to spinning arena and main soundstage.',
        priceUSD: 15,
        availableQuantity: 280,
        totalQuantity: 500,
        phaseLabel: 'Phase 1',
        maxPerOrder: 6,
        perks: ['Main Soundstage', 'Motorsport Arena Access', 'Food Village']
      },
      {
        id: 'tier-oct-ga',
        name: 'General Admission',
        description: 'Standard festival access once Phase 1 sells out.',
        priceUSD: 20,
        availableQuantity: 1200,
        totalQuantity: 1500,
        phaseLabel: 'Phase 2',
        maxPerOrder: 6,
        perks: ['Full Arena Access']
      },
      {
        id: 'tier-oct-vip',
        name: 'VIP Golden Circle',
        description: 'Raised deck viewing, dedicated EcoCash express bar, executive facilities.',
        priceUSD: 50,
        availableQuantity: 65,
        totalQuantity: 200,
        phaseLabel: 'VIP Deck',
        maxPerOrder: 4,
        perks: ['Raised Viewing Deck', 'Express Bar', 'Official Wristband']
      },
      {
        id: 'tier-oct-cooler',
        name: 'Coolerbox Permit (Add-on)',
        description: 'Permit for 1 coolerbox up to 40L. Strictly cans & plastic only. No glass.',
        priceUSD: 10,
        availableQuantity: 220,
        totalQuantity: 300,
        phaseLabel: 'Add-on Pass',
        maxPerOrder: 2,
        perks: ['Valid for 1 Coolerbox', 'Cans only (no glass)']
      }
    ],
    policies: {
      ageRestriction: '18+ Only (Government ID Required)',
      coolerboxAllowed: true,
      coolerboxDetails: 'Coolerboxes require valid Coolerbox Permit. Strictly cans only, no glass bottles.',
      refundPolicy: 'Non-refundable except in case of event cancellation.',
      gateRules: [
        'Gates open at 12:00 PM.',
        'Strict security search at Gate 1 and Gate 2.',
        'Digital QR ticket must be presented on phone screen.'
      ]
    },
    organizer: {
      name: 'Selekta Base Official',
      isVerified: true,
      contactEmail: 'tickets@selektabase.co.zw',
      contactPhone: '+263 77 100 2400',
      about: 'Zimbabwe’s leading outdoor sound system and car culture brand.'
    }
  },
  {
    id: 'evt-summer-blowout-2026',
    title: 'Selekta Base BlowOut Festival: Season Finale',
    slug: 'selekta-base-blowout-festival-season-finale',
    tagline: 'The pinnacle festival edition featuring Zimbabwe’s premier car spinning and urban sound culture',
    description: 'The monumental Selekta Base BlowOut Festival returns for its year-end season finale. Uniting the top precision drifters, monster soundsystems, and national live acts at Borrowdale Racecourse.',
    posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowout.jpg',
    heroUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouts.jpg',
    category: 'festivals',
    city: 'Harare',
    venueName: 'Borrowdale Racecourse Grounds',
    venueAddress: 'Borrowdale Road, Harare',
    startDate: '2026-12-27T12:00:00Z',
    endDate: '2026-12-28T02:00:00Z',
    status: 'on_sale',
    isFeatured: true,
    isSelectaBaseOriginal: true,
    startingPriceUSD: 15,
    ticketTiers: [
      {
        id: 'tier-sb-eb',
        name: 'Phase 1 Early Bird',
        description: 'Standard festival entry to spinning arena and main soundstage.',
        priceUSD: 15,
        availableQuantity: 280,
        totalQuantity: 500,
        phaseLabel: 'Phase 1',
        maxPerOrder: 6,
        perks: ['Main Soundstage', 'Motorsport Arena Access', 'Food Village']
      },
      {
        id: 'tier-sb-ga',
        name: 'General Admission',
        description: 'Standard festival access once Phase 1 sells out.',
        priceUSD: 20,
        availableQuantity: 1200,
        totalQuantity: 1500,
        phaseLabel: 'Phase 2',
        maxPerOrder: 6,
        perks: ['Full Arena Access']
      },
      {
        id: 'tier-sb-vip',
        name: 'VIP Golden Circle',
        description: 'Raised deck viewing, dedicated EcoCash express bar, executive facilities.',
        priceUSD: 50,
        availableQuantity: 65,
        totalQuantity: 200,
        phaseLabel: 'VIP Deck',
        maxPerOrder: 4,
        perks: ['Raised Viewing Deck', 'Express Bar', 'Official Wristband']
      },
      {
        id: 'tier-sb-cooler',
        name: 'Coolerbox Permit (Add-on)',
        description: 'Permit for 1 coolerbox up to 40L. Strictly cans & plastic only. No glass.',
        priceUSD: 10,
        availableQuantity: 220,
        totalQuantity: 300,
        phaseLabel: 'Add-on Pass',
        maxPerOrder: 2,
        perks: ['Valid for 1 Coolerbox', 'Cans only (no glass)']
      }
    ],
    policies: {
      ageRestriction: '18+ Only (Government ID Required)',
      coolerboxAllowed: true,
      coolerboxDetails: 'Coolerboxes require valid Coolerbox Permit. Strictly cans only, no glass bottles.',
      refundPolicy: 'Non-refundable except in case of event cancellation.',
      gateRules: [
        'Gates open at 12:00 PM.',
        'Strict security search at Gate 1 and Gate 2.',
        'Digital QR ticket must be presented on phone screen.'
      ]
    },
    organizer: {
      name: 'Selekta Base Official',
      isVerified: true,
      contactEmail: 'tickets@selektabase.co.zw',
      contactPhone: '+263 77 100 2400',
      about: 'Zimbabwe’s leading outdoor sound system and car culture brand.'
    }
  },
  {
    id: 'evt-soundsystem-session',
    title: 'Selekta Base Soundsystem Showcase',
    slug: 'selekta-base-soundsystem-showcase',
    tagline: 'Handcrafted dub sirens, deep afro-house & log-drum amapiano',
    description: 'An authentic sound immersion curated by Selekta Base at the Old Georgians Sports Club Pavilion. Built for true audiophiles, this session highlights custom handcrafted sound cabinets, rare reggae dubplates, deep afro-house rhythms, and heavy log-drum amapiano in an open-air sunset setting.',
    posterUrl: SELECTA_BASE_BRAND_POSTER,
    heroUrl: SELECTA_BASE_BRAND_POSTER,
    category: 'music',
    city: 'Harare',
    venueName: 'Old Georgians Sports Club Pavilion',
    venueAddress: 'The Chase, Groombridge, Harare',
    startDate: '2026-11-21T16:00:00Z',
    endDate: '2026-11-22T01:00:00Z',
    status: 'on_sale',
    isSelectaBaseOriginal: true,
    startingPriceUSD: 10,
    ticketTiers: [
      {
        id: 'tier-dusk-ga',
        name: 'General Session Pass',
        description: 'Pavilion lawn access and soundsystem dancefloor.',
        priceUSD: 10,
        availableQuantity: 110,
        totalQuantity: 300,
        phaseLabel: 'Standard Entry',
        maxPerOrder: 4,
        perks: ['Soundsystem Arena Access']
      },
      {
        id: 'tier-dusk-vip',
        name: 'VIP Terrace & Welcome Drink',
        description: 'Terrace lounge seating with 1 complimentary artisanal cocktail.',
        priceUSD: 25,
        availableQuantity: 28,
        totalQuantity: 60,
        phaseLabel: 'VIP Terrace',
        maxPerOrder: 4,
        perks: ['1 Welcome Cocktail', 'Reserved Terrace']
      }
    ],
    policies: {
      ageRestriction: '21+ Smart Casual',
      coolerboxAllowed: false,
      refundPolicy: 'Non-refundable.',
      gateRules: ['Photo ID required at entrance.']
    },
    organizer: {
      name: 'Selekta Base Official',
      isVerified: true,
      contactEmail: 'tickets@selektabase.co.zw'
    }
  }
];

// Seed sample orders for instant testing & booking recovery demo
export const INITIAL_SAMPLE_ORDERS: import('../types').Order[] = [
  {
    id: 'SB-8921-HRE',
    eventId: 'evt-colour-run-2026',
    eventTitle: 'Grand Colour Run Family Fun Day 2026',
    eventDate: '2026-12-06T07:00:00Z',
    eventVenue: 'Borrowdale Racecourse, Harare',
    customerName: 'Tendai Moyo',
    customerEmail: 'tendai.moyo@gmail.com',
    customerPhone: '+263 77 245 9012',
    items: [
      {
        tierId: 'tier-cr-indiv',
        tierName: 'Individual Runner Pass',
        unitPriceUSD: 5,
        quantity: 2
      }
    ],
    subtotalUSD: 10,
    serviceFeeUSD: 0.50,
    totalUSD: 10.50,
    currency: 'USD',
    paymentMethod: 'ecocash_merchant',
    paymentStatus: 'verified',
    paymentReference: 'ECO-MERCH-ZW-99214710',
    createdAt: '2026-10-18T11:22:00Z',
    tickets: [
      {
        ticketId: 'TKT-SB-8921-01',
        orderReference: 'SB-8921-HRE',
        eventId: 'evt-colour-run-2026',
        eventTitle: 'Grand Colour Run Family Fun Day 2026',
        eventDate: '2026-12-06T07:00:00Z',
        eventVenue: 'Borrowdale Racecourse, Harare',
        tierId: 'tier-cr-indiv',
        tierName: 'Individual Runner Pass',
        holderName: 'Tendai Moyo',
        entryStatus: 'VALID',
        qrPayload: 'SELEKTA_BASE:VALID:TKT-SB-8921-01:SB-8921-HRE:evt-colour-run-2026:SIG_8f7b2c9e',
        shareableToken: 'sb-pass-tok-8921-01-a49b',
        priceUSD: 5
      },
      {
        ticketId: 'TKT-SB-8921-02',
        orderReference: 'SB-8921-HRE',
        eventId: 'evt-colour-run-2026',
        eventTitle: 'Grand Colour Run Family Fun Day 2026',
        eventDate: '2026-12-06T07:00:00Z',
        eventVenue: 'Borrowdale Racecourse, Harare',
        tierId: 'tier-cr-indiv',
        tierName: 'Individual Runner Pass',
        holderName: 'Farai Moyo (Guest)',
        entryStatus: 'VALID',
        qrPayload: 'SELEKTA_BASE:VALID:TKT-SB-8921-02:SB-8921-HRE:evt-colour-run-2026:SIG_1c4d9a2e',
        shareableToken: 'sb-pass-tok-8921-02-b38c',
        priceUSD: 5
      }
    ]
  }
];
