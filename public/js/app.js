/**
 * SELEKTA BASE — Master Client Application
 * Pure Vanilla JavaScript (No Build Step Required — Cloudflare Pages Ready)
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY_ORDERS = 'selectabase_orders_v1';
  const STORAGE_KEY_PROFILE = 'selectabase_profile_v1';
  const STORAGE_KEY_CURRENCY = 'selectabase_currency_v1';
  const ZIM_EXCHANGE_RATE_ZIG = 26.5;

  // --- Brand Assets ---
  const BRAND_POSTER = 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg';

  // --- Official Zimbabwe Event Database ---
  const OFFICIAL_EVENTS = [
    {
      id: 'evt-colour-run-2026',
      title: 'Grand Colour Run Family Fun Day 2026',
      slug: 'grand-colour-run-family-fun-day-2026',
      tagline: '5KM color fun walk & festival with live sound, family zones & craft food',
      description: 'Harare’s most anticipated family wellness and open-air celebration returns to Borrowdale Racecourse on Sunday, 6 December 2026. Participants walk, jog, or dance through 5 color powder zones along an untimed 5KM route. The day concludes in a massive synchronized color explosion at midday, featuring live stage performances, kids water play zones, and curated artisan food stalls.',
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
      startingPriceUSD: 5,
      ticketTiers: [
        { id: 'cr-tier-early', name: 'Early Bird Runner Pass', priceUSD: 5, maxPerOrder: 6, phaseLabel: 'Phase 1' },
        { id: 'cr-tier-gen', name: 'Standard Family Pack (4 Entries)', priceUSD: 18, maxPerOrder: 4, phaseLabel: 'Family' },
        { id: 'cr-tier-vip', name: 'VIP Pavilion Pass', priceUSD: 25, maxPerOrder: 4, phaseLabel: 'VIP Lounge' },
        { id: 'cr-tier-cooler', name: 'Official Coolerbox Pass', priceUSD: 10, maxPerOrder: 2, phaseLabel: 'Add-on' }
      ],
      policies: {
        ageRestriction: 'All Ages • Family Friendly',
        coolerboxAllowed: true,
        coolerboxDetails: 'Permitted with official Coolerbox Pass. Strictly NO glass bottles permitted on turf lawns.',
        refundPolicy: 'Non-refundable once purchased. Valid for rescheduled date in case of adverse weather.',
        gateRules: [
          'Gates open at 06:30 AM. Fun walk kicks off promptly at 07:30 AM.',
          'Powder is 100% certified non-toxic food-grade cornstarch.',
          'High-contrast digital QR pass on mobile required for scanning at gate.'
        ]
      },
      organizer: {
        name: 'Selekta Base x Hype Nation Zimbabwe',
        isVerified: true,
        contactEmail: 'tickets@selektabase.co.zw'
      }
    },
    {
      id: 'evt-october-blowout-2026',
      title: 'October BlowOut 2026: The Precision Arena',
      slug: 'october-blowout-2026',
      tagline: 'Precision tire-smoking spins, automotive soundstages & urban festival culture',
      description: 'Harare’s premier automotive lifestyle festival takes over Borrowdale Racecourse Arena. Witness Zimbabwe’s finest precision drift drivers, twin outdoor sound walls, street food trucks, and high-energy performance stages.',
      posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octoberblowout.jpg',
      heroUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octo%20blowours.jpg',
      category: 'festivals',
      city: 'Harare',
      venueName: 'Borrowdale Racecourse Arena',
      venueAddress: 'Borrowdale Road, Harare',
      startDate: '2026-10-24T12:00:00Z',
      endDate: '2026-10-24T23:00:00Z',
      status: 'on_sale',
      isFeatured: true,
      startingPriceUSD: 10,
      ticketTiers: [
        { id: 'bo-tier-general', name: 'General Arena Pass', priceUSD: 10, maxPerOrder: 8, phaseLabel: 'Early Release' },
        { id: 'bo-tier-pit', name: 'VIP Pit Lane Access', priceUSD: 30, maxPerOrder: 4, phaseLabel: 'Limited VIP' },
        { id: 'bo-tier-cooler', name: 'Coolerbox Permit Pass', priceUSD: 10, maxPerOrder: 2, phaseLabel: 'Add-on' }
      ],
      policies: {
        ageRestriction: '18+ Recommended for Evening Stages',
        coolerboxAllowed: true,
        coolerboxDetails: 'Cans and plastic bottles only. Strictly zero glass containers permitted inside arena fencing.',
        refundPolicy: 'Tickets non-refundable once scanned or transferred.',
        gateRules: [
          'Security checks and metal detector screenings enforced at all entrance lanes.',
          'Keep passes ready on your mobile screen for instant digital gate scanning.'
        ]
      },
      organizer: {
        name: 'Selekta Base Zimbabwe',
        isVerified: true,
        contactEmail: 'events@selektabase.co.zw'
      }
    },
    {
      id: 'evt-blowout-fest-2026',
      title: 'Selekta Base BlowOut Festival 2026',
      slug: 'selekta-base-blowout-festival-2026',
      tagline: 'Celebrating over a decade of Zimbabwean car culture and music soundstages',
      description: 'The landmark annual gathering founded in 2015 by Arnold Tinashe Chigwerewe. A showcase of motorsport, urban youth sound systems, and Zimbabwe’s most influential creators.',
      posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowout.jpg',
      heroUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouts.jpg',
      category: 'music',
      city: 'Harare',
      venueName: 'Borrowdale Racecourse Arena',
      venueAddress: 'Borrowdale Road, Harare',
      startDate: '2026-11-28T14:00:00Z',
      endDate: '2026-11-29T02:00:00Z',
      status: 'on_sale',
      isFeatured: false,
      startingPriceUSD: 15,
      ticketTiers: [
        { id: 'bf-tier-phase1', name: 'Phase 1 Standard Pass', priceUSD: 15, maxPerOrder: 6, phaseLabel: 'Phase 1' },
        { id: 'bf-tier-gold', name: 'Golden Circle Stage Pass', priceUSD: 40, maxPerOrder: 4, phaseLabel: 'Stage Front' }
      ],
      policies: {
        ageRestriction: '18+ Only',
        coolerboxAllowed: false,
        coolerboxDetails: 'On-site licensed bars and artisan beverage stations available.',
        refundPolicy: 'No refunds once transaction is finalized.',
        gateRules: ['Digital QR pass required at entrance gate.']
      },
      organizer: {
        name: 'Selekta Base Zimbabwe',
        isVerified: true,
        contactEmail: 'tickets@selektabase.co.zw'
      }
    },
    {
      id: 'evt-harare-soundclash',
      title: 'Harare Sound Clash & Urban Bassline',
      slug: 'harare-sound-clash',
      tagline: 'High-power sound system duel with top local DJs and live MCs',
      description: 'The ultimate underground reggae, dancehall, and amapiano soundclash uniting top selector crews under the Harare stars.',
      posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorfest.jpg',
      category: 'nightlife',
      city: 'Harare',
      venueName: 'Longcheng Plaza Arena',
      venueAddress: 'Samora Machel Ave, Harare',
      startDate: '2026-12-18T18:00:00Z',
      endDate: '2026-12-19T04:00:00Z',
      status: 'on_sale',
      isFeatured: false,
      startingPriceUSD: 8,
      ticketTiers: [
        { id: 'sc-early', name: 'Standard Entry Pass', priceUSD: 8, maxPerOrder: 6, phaseLabel: 'Advance' },
        { id: 'sc-vip', name: 'VIP Deck Access', priceUSD: 20, maxPerOrder: 4, phaseLabel: 'VIP Deck' }
      ],
      policies: {
        ageRestriction: '18+ Only',
        coolerboxAllowed: false,
        refundPolicy: 'Standard Selekta Base policy applies.',
        gateRules: ['Valid national ID or passport required for entry.']
      },
      organizer: {
        name: 'Selekta Base Soundsystem',
        isVerified: true,
        contactEmail: 'info@selektabase.co.zw'
      }
    }
  ];

  // --- Official Stories Media ---
  const OFFICIAL_STORIES = [
    {
      id: 'story-colour-run-2026',
      title: 'Colourfest',
      isPastArchive: false,
      statusLabel: 'COMING SOON',
      coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
      slides: [
        {
          id: 'cr-vid-1',
          isVideo: true,
          videoUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Video%20colourfest%20preview.mp4',
          posterUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
          caption: 'Official video preview of the Grand Colour Run & Colourfest returning to Borrowdale Racecourse on 6 December 2026.'
        },
        {
          id: 'cr-poster-2',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colorrun%20poster.jpg',
          caption: 'Official Grand Colour Run Family Fun Day poster: 5KM untimed celebration of family and wellness.'
        },
        {
          id: 'cr-fest-3',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Colourfest.jpg',
          caption: 'Colourfest memories: vibrant powdered pigments and live stage performances under Harare skies.'
        }
      ]
    },
    {
      id: 'story-blowout-october',
      title: 'Oct BlowOut',
      isPastArchive: true,
      statusLabel: 'ARCHIVE',
      coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octoberblowout.jpg',
      slides: [
        {
          id: 'bo-oct-1',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octoberblowout.jpg',
          caption: 'Official October Blowout artwork: Harare’s premier precision spinning arena and outdoor sound stages.'
        },
        {
          id: 'bo-oct-2',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Octo%20blowours.jpg',
          caption: 'Crowd flashbacks: precision motorsport and outdoor sound clash at Borrowdale Racecourse Arena.'
        }
      ]
    },
    {
      id: 'story-blowout-fest',
      title: 'BlowOut Fest',
      isPastArchive: true,
      statusLabel: 'FESTIVAL',
      coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowout.jpg',
      slides: [
        {
          id: 'bo-fest-1',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowout.jpg',
          caption: 'The landmark Selekta Base BlowOut Festival: undisputed home of tire-smoking wheel spins and live music.'
        },
        {
          id: 'bo-fest-2',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouts.jpg',
          caption: 'Festival arena energy: roaring engines and crowd roar at Borrowdale Racecourse.'
        }
      ]
    },
    {
      id: 'story-blowout-vault',
      title: '10-Yr Vault',
      isPastArchive: true,
      statusLabel: '10TH ANNIV',
      coverImage: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouut.jpg',
      slides: [
        {
          id: 'bo-vault-1',
          imageUrl: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/SelectorBase/Blowouut.jpg',
          caption: 'Celebrating over a decade of Selekta Base culture: founded in 2015 by Arnold Tinashe Chigwerewe.'
        }
      ]
    }
  ];

  // Initial Sample Orders
  const INITIAL_ORDERS = [
    {
      id: 'SB-8921-HRE',
      eventId: 'evt-colour-run-2026',
      eventTitle: 'Grand Colour Run Family Fun Day 2026',
      eventDate: 'Sun 6 Dec 2026 • 07:00 AM',
      eventVenue: 'Borrowdale Racecourse, Harare',
      customerName: 'Tendai Moyo',
      customerPhone: '+263 77 245 9012',
      customerEmail: 'tendai.moyo@gmail.com',
      totalUSD: 15.50,
      currency: 'USD',
      paymentMethod: 'ecocash_merchant',
      paymentStatus: 'verified',
      paymentReference: 'MP-890214-ZW',
      createdAt: new Date().toISOString(),
      tickets: [
        {
          ticketId: 'TKT-8921-HRE-01',
          orderReference: 'SB-8921-HRE',
          eventId: 'evt-colour-run-2026',
          eventTitle: 'Grand Colour Run Family Fun Day 2026',
          tierName: 'Early Bird Runner Pass',
          holderName: 'Tendai Moyo',
          entryStatus: 'VALID',
          priceUSD: 5
        },
        {
          ticketId: 'TKT-8921-HRE-02',
          orderReference: 'SB-8921-HRE',
          eventId: 'evt-colour-run-2026',
          eventTitle: 'Grand Colour Run Family Fun Day 2026',
          tierName: 'Official Coolerbox Pass',
          holderName: 'Tendai Moyo (Coolerbox)',
          entryStatus: 'VALID',
          priceUSD: 10
        }
      ]
    }
  ];

  // --- State Accessors ---
  function getCurrency() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
      return (saved === 'ZiG' || saved === 'USD') ? saved : 'USD';
    } catch (e) {
      return 'USD';
    }
  }

  function setCurrency(cur) {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, cur);
      window.dispatchEvent(new CustomEvent('currencychange', { detail: cur }));
    } catch (e) {
      console.warn('Currency storage failed:', e);
    }
  }

  function formatPrice(amountUSD) {
    const cur = getCurrency();
    if (cur === 'ZiG') {
      const zig = (amountUSD * ZIM_EXCHANGE_RATE_ZIG).toFixed(0);
      return `ZiG ${Number(zig).toLocaleString()}`;
    }
    return `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`;
  }

  function getCustomerProfile() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Tendai Moyo',
      phone: '+263 77 245 9012',
      email: 'tendai.moyo@gmail.com'
    };
  }

  function saveCustomerProfile(data) {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(data));
    } catch (e) {}
  }

  function getOrders() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ORDERS;
  }

  function saveOrders(orders) {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('orderschange'));
    } catch (e) {}
  }

  function getAllTickets() {
    const orders = getOrders();
    return orders.flatMap(o => o.tickets);
  }

  function maskPhone(phoneStr) {
    if (!phoneStr || phoneStr.trim().length < 6) return 'No number linked';
    const clean = phoneStr.trim();
    if (clean.startsWith('+263')) {
      const remaining = clean.slice(4).trim();
      const code = remaining.slice(0, 2);
      const lastDigits = remaining.slice(-2);
      return `+263 ${code} ••• ••${lastDigits}`;
    }
    const start = clean.slice(0, 3);
    const end = clean.slice(-2);
    return `${start} ••• ••${end}`;
  }

  // --- Pure JS High-Contrast SVG QR Code Generator ---
  function createQRCodeSVG(text) {
    // Generate deterministic high-contrast pattern based on text signature
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    const size = 21; // 21x21 modules standard Version 1
    const matrix = [];
    for (let r = 0; r < size; r++) {
      matrix[r] = [];
      for (let c = 0; c < size; c++) {
        // Standard Finder patterns (Top-left, top-right, bottom-left 7x7)
        const isTLFinder = (r < 7 && c < 7);
        const isTRFinder = (r < 7 && c >= size - 7);
        const isBLFinder = (r >= size - 7 && c < 7);

        if (isTLFinder || isTRFinder || isBLFinder) {
          const fr = r >= size - 7 ? r - (size - 7) : r;
          const fc = c >= size - 7 ? c - (size - 7) : c;
          const isOuterBorder = (fr === 0 || fr === 6 || fc === 0 || fc === 6);
          const isInnerSquare = (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4);
          matrix[r][c] = isOuterBorder || isInnerSquare;
        } else if (r === 6 || c === 6) {
          // Timing patterns
          matrix[r][c] = (r + c) % 2 === 0;
        } else {
          // Data modules derived from payload hash
          const bit = Math.abs((hash ^ (r * 31 + c * 17) ^ (text.charCodeAt((r + c) % text.length))) % 2) === 1;
          matrix[r][c] = bit;
        }
      }
    }

    let rects = '';
    const moduleSize = 10;
    const padding = 15;
    const totalDim = size * moduleSize + padding * 2;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          rects += `<rect x="${padding + c * moduleSize}" y="${padding + r * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#20231F"/>`;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalDim} ${totalDim}" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
      ${rects}
    </svg>`;
  }

  // --- Shared Header & Bottom Navigation ---
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 8) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchBar = document.getElementById('search-expandable-bar');
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');

    if (searchToggleBtn && searchBar) {
      searchToggleBtn.addEventListener('click', () => {
        searchBar.classList.toggle('open');
        if (searchBar.classList.contains('open') && searchInput) {
          searchInput.focus();
        }
      });
    }

    if (searchClearBtn && searchInput) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      });
    }
  }

  let isNavigating = false;

  async function navigateToPage(targetUrl, targetPage, pushHistory = true) {
    if (isNavigating) return;

    // Determine current logical page
    const currentPath = window.location.pathname.toLowerCase();
    let currentPage = 'home';
    if (currentPath.includes('explore')) currentPage = 'explore';
    else if (currentPath.includes('tickets')) currentPage = 'tickets';
    else if (currentPath.includes('account')) currentPage = 'account';

    // Canonical clean URL for display & navigation
    let cleanUrl = targetUrl;
    if (targetPage === 'home') cleanUrl = '/';
    else if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl.replace(/\.html$/, '');

    // If tapping the already active tab, smoothly scroll to top
    if (targetPage === currentPage && (!pushHistory || window.location.pathname === cleanUrl)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    isNavigating = true;

    // Immediately highlight the selected tab in bottom nav for 0ms latency response
    const nav = document.querySelector('.bottom-nav');
    if (nav) {
      nav.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-page') === targetPage);
      });
    }

    try {
      // Determine fetch path
      const fetchPath = cleanUrl === '/' ? '/index.html' : cleanUrl;
      const response = await fetch(fetchPath, {
        headers: { 'Accept': 'text/html' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const htmlText = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');

      // 1. Update document title
      if (newDoc.title) {
        document.title = newDoc.title;
      }

      // 2. Replace main content
      const newMain = newDoc.querySelector('.main-content');
      const currentMain = document.querySelector('.main-content');
      if (newMain && currentMain) {
        currentMain.innerHTML = newMain.innerHTML;
        const newStyle = newMain.getAttribute('style');
        if (newStyle) currentMain.setAttribute('style', newStyle);
        else currentMain.removeAttribute('style');
      }

      // 3. Update header inner
      const newHeaderInner = newDoc.querySelector('.header-inner');
      const currentHeaderInner = document.querySelector('.header-inner');
      if (newHeaderInner && currentHeaderInner) {
        currentHeaderInner.innerHTML = newHeaderInner.innerHTML;
      }

      // 4. Transfer any page-specific modals (QR pass, staff PIN auth, reset confirm, story viewer)
      const modalIds = [
        'qr-pass-modal',
        'staff-auth-modal',
        'reset-confirm-modal',
        'story-viewer-modal',
        'guest-recovery-modal'
      ];
      modalIds.forEach(id => {
        const newModal = newDoc.getElementById(id);
        const curModal = document.getElementById(id);
        if (newModal) {
          if (curModal) curModal.replaceWith(newModal);
          else document.querySelector('.app-container')?.appendChild(newModal);
        }
      });

      // 5. Update browser history with canonical clean URL
      if (pushHistory) {
        history.pushState({ page: targetPage, url: cleanUrl }, '', cleanUrl);
      }

      // 6. Initialize header & bottom nav state
      initHeader();
      initBottomNav(targetPage);

      // 7. Dispatch target page initializer
      if (targetPage === 'home') {
        initIndexPage();
      } else if (targetPage === 'explore') {
        initExplorePage();
      } else if (targetPage === 'tickets') {
        initTicketsPage();
      } else if (targetPage === 'account') {
        initAccountPage();
      }

      // 8. Scroll to top
      window.scrollTo(0, 0);
    } catch (err) {
      console.warn('[Selekta Base Navigation] Seamless swap fallback to direct navigation:', err);
      // Hard fallback: direct browser navigation
      window.location.href = cleanUrl;
    } finally {
      isNavigating = false;
    }
  }

  function initBottomNav(activePage) {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    const validTickets = getAllTickets().filter(t => t.entryStatus === 'VALID');
    const countBadge = document.getElementById('tickets-badge-count');
    if (countBadge) {
      if (validTickets.length > 0) {
        countBadge.textContent = validTickets.length;
        countBadge.style.display = 'flex';
      } else {
        countBadge.style.display = 'none';
      }
    }

    // Set active link
    const items = nav.querySelectorAll('.nav-item');
    items.forEach(item => {
      const page = item.getAttribute('data-page');
      if (page === activePage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Attach click handler once for seamless, loop-free internal navigation
    if (!nav.dataset.navBound) {
      nav.dataset.navBound = 'true';
      nav.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;

        const targetPage = item.getAttribute('data-page');
        const targetHref = item.getAttribute('href') || '/';

        e.preventDefault();
        navigateToPage(targetHref, targetPage, true);
      });
    }
  }

  // --- Full-Screen Pure Social Media Story Viewer ---
  function initStoriesViewer() {
    const modal = document.getElementById('story-viewer-modal');
    if (!modal) return;

    function bindStoryThumbnails(openStoryFn) {
      document.querySelectorAll('.story-thumb-btn').forEach(btn => {
        if (!btn.dataset.bound) {
          btn.dataset.bound = 'true';
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-story-id');
            if (id && openStoryFn) openStoryFn(id);
          });
        }
      });
    }

    if (modal.dataset.bound === 'true') {
      if (typeof window._selektaOpenStory === 'function') {
        bindStoryThumbnails(window._selektaOpenStory);
      }
      return;
    }
    modal.dataset.bound = 'true';

    let currentStory = null;
    let currentSlideIdx = 0;
    let photoRafId = null;
    let isPaused = false;
    let isMuted = true;
    let pressTimer = null;
    let pressStartPos = null;
    let isLongPress = false;

    const canvas = modal.querySelector('.viewer-media-canvas');
    const progressSegments = modal.querySelector('.viewer-progress-segments');
    const avatarImg = modal.querySelector('.viewer-avatar img');
    const titleEl = modal.querySelector('.viewer-title');
    const statusEl = modal.querySelector('.viewer-status');
    const muteBtn = modal.querySelector('#viewer-mute-btn');
    const closeBtn = modal.querySelector('#viewer-close-btn');
    const playOverlay = modal.querySelector('#viewer-play-overlay');

    function openStory(storyId) {
      currentStory = OFFICIAL_STORIES.find(s => s.id === storyId) || OFFICIAL_STORIES[0];
      currentSlideIdx = 0;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderStorySlide();
    }

    function closeStory() {
      cancelPhotoTimer();
      const video = canvas.querySelector('video');
      if (video) {
        try { video.pause(); } catch (e) {}
      }
      modal.classList.remove('active');
      document.body.style.overflow = '';
      currentStory = null;
    }

    function cancelPhotoTimer() {
      if (photoRafId) {
        cancelAnimationFrame(photoRafId);
        photoRafId = null;
      }
    }

    function renderStorySlide() {
      cancelPhotoTimer();
      if (!currentStory) return;
      const slide = currentStory.slides[currentSlideIdx];
      if (!slide) return;

      // Update header
      avatarImg.src = currentStory.coverImage;
      titleEl.textContent = currentStory.title;
      statusEl.textContent = `• ${currentStory.statusLabel || (currentStory.isPastArchive ? 'Archive' : 'Upcoming')}`;

      // Update Progress segments
      progressSegments.innerHTML = '';
      currentStory.slides.forEach((_, idx) => {
        const seg = document.createElement('div');
        seg.className = 'viewer-segment';
        const fill = document.createElement('div');
        fill.className = 'viewer-segment-fill';
        if (idx < currentSlideIdx) {
          fill.style.width = '100%';
        } else if (idx === currentSlideIdx) {
          fill.style.width = '0%';
        } else {
          fill.style.width = '0%';
        }
        seg.appendChild(fill);
        progressSegments.appendChild(seg);
      });

      const currentFillEl = progressSegments.children[currentSlideIdx]?.querySelector('.viewer-segment-fill');

      // Clear media canvas
      canvas.innerHTML = '';
      if (playOverlay) {
        playOverlay.classList.remove('show');
        canvas.appendChild(playOverlay);
      }

      if (slide.isVideo) {
        if (muteBtn) muteBtn.style.display = 'flex';

        // Poster image behind video so media area is never black
        const posterImg = document.createElement('img');
        posterImg.src = slide.posterUrl || slide.imageUrl || BRAND_POSTER;
        posterImg.style.position = 'absolute';
        posterImg.style.inset = '0';
        canvas.appendChild(posterImg);

        const video = document.createElement('video');
        video.src = slide.videoUrl;
        video.poster = slide.posterUrl || slide.imageUrl || BRAND_POSTER;
        video.playsInline = true;
        video.muted = isMuted;
        video.preload = 'auto';
        video.style.position = 'absolute';
        video.style.inset = '0';

        video.addEventListener('timeupdate', () => {
          if (video.duration && currentFillEl) {
            const pct = (video.currentTime / video.duration) * 100;
            currentFillEl.style.width = `${pct}%`;
          }
        });

        video.addEventListener('ended', () => {
          if (currentFillEl) currentFillEl.style.width = '100%';
          advanceSlide();
        });

        video.addEventListener('error', () => {
          console.warn('Video failed to load');
          if (playOverlay) playOverlay.classList.add('show');
        });

        canvas.appendChild(video);

        video.play().catch(() => {
          if (playOverlay) playOverlay.classList.add('show');
        });

      } else {
        if (muteBtn) muteBtn.style.display = 'none';

        const img = document.createElement('img');
        img.src = slide.imageUrl || BRAND_POSTER;
        canvas.appendChild(img);

        // 5s automatic photo timer loop
        let elapsed = 0;
        let lastTime = performance.now();
        const duration = 5000;

        function step(now) {
          const dt = now - lastTime;
          lastTime = now;

          if (!isPaused) {
            elapsed += dt;
            const pct = Math.min(100, (elapsed / duration) * 100);
            if (currentFillEl) currentFillEl.style.width = `${pct}%`;

            if (elapsed >= duration) {
              advanceSlide();
              return;
            }
          }

          photoRafId = requestAnimationFrame(step);
        }

        photoRafId = requestAnimationFrame(step);
      }
    }

    function advanceSlide() {
      if (!currentStory) return;
      if (currentSlideIdx < currentStory.slides.length - 1) {
        currentSlideIdx++;
        renderStorySlide();
      } else {
        closeStory();
      }
    }

    function previousSlide() {
      if (!currentStory) return;
      if (currentSlideIdx > 0) {
        currentSlideIdx--;
        renderStorySlide();
      } else {
        renderStorySlide();
      }
    }

    // Pointer event handling: Press-and-hold pause + Tap to skip/rewind + Swipe down to close
    canvas.addEventListener('pointerdown', (e) => {
      pressStartPos = { x: e.clientX, y: e.clientY };
      isLongPress = false;

      pressTimer = setTimeout(() => {
        isLongPress = true;
        isPaused = true;
        const video = canvas.querySelector('video');
        if (video) video.pause();
      }, 220);
    });

    canvas.addEventListener('pointerup', (e) => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }

      if (isLongPress) {
        isPaused = false;
        isLongPress = false;
        const video = canvas.querySelector('video');
        if (video && !video.ended) video.play().catch(() => {});
        return;
      }

      // Check swipe gestures
      if (pressStartPos) {
        const deltaY = e.clientY - pressStartPos.y;
        const deltaX = e.clientX - pressStartPos.x;

        // Swipe down > 55px -> close
        if (deltaY > 55 && Math.abs(deltaY) > Math.abs(deltaX) * 1.4) {
          closeStory();
          return;
        }

        // Horizontal swipe
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
          if (deltaX < 0) {
            advanceSlide();
          } else {
            previousSlide();
          }
          return;
        }
      }

      // Tap navigation: Left 35% -> previous; Right 65% -> advance
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width * 0.35) {
        previousSlide();
      } else {
        advanceSlide();
      }
    });

    canvas.addEventListener('pointercancel', () => {
      if (pressTimer) clearTimeout(pressTimer);
      isPaused = false;
      isLongPress = false;
    });

    if (closeBtn) closeBtn.addEventListener('click', closeStory);

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const video = canvas.querySelector('video');
        if (video) {
          video.muted = !video.muted;
          isMuted = video.muted;
          muteBtn.innerHTML = isMuted 
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#20C982" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
        }
      });
    }

    window._selektaOpenStory = openStory;
    bindStoryThumbnails(openStory);

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeStory();
      if (e.key === 'ArrowRight') advanceSlide();
      if (e.key === 'ArrowLeft') previousSlide();
    });
  }

  // --- Page Initializers ---
  function initIndexPage() {
    initHeader();
    initBottomNav('home');
    initStoriesViewer();

    const feedContainer = document.getElementById('event-feed-list');
    const searchInput = document.getElementById('search-input');

    function renderEvents(list) {
      if (!feedContainer) return;
      if (list.length === 0) {
        feedContainer.innerHTML = `
          <div style="background:#EAE5DB; border:1px solid #DCD6CB; border-radius:18px; padding:24px; text-align:center;">
            <p style="font-size:12px; color:#6F776D;">No official events found matching your search.</p>
          </div>`;
        return;
      }

      feedContainer.innerHTML = list.map(evt => `
        <article class="event-card">
          <div class="card-poster">
            <img src="${evt.posterUrl}" alt="${evt.title}" loading="lazy" onerror="this.src='${BRAND_POSTER}'" />
            <span class="card-status-chip ${evt.status === 'on_sale' ? 'on-sale' : ''}">
              ${evt.status === 'on_sale' ? 'Official Release' : 'Coming Soon'}
            </span>
          </div>
          <div class="card-body">
            <div class="card-date-row">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${new Date(evt.startDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <h3 class="card-title">${evt.title}</h3>
            <div class="card-venue-row">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${evt.venueName}, ${evt.city}</span>
            </div>
            <div class="card-footer">
              <div>
                <span class="card-price-label">From</span>
                <span class="card-price-val">${formatPrice(evt.startingPriceUSD)}</span>
              </div>
              <div style="display:flex; gap:6px;">
                <a href="event.html?id=${evt.id}" class="btn-secondary">Details</a>
                <a href="checkout.html?event=${evt.id}" class="btn-primary">Get Tickets</a>
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }

    renderEvents(OFFICIAL_EVENTS);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = OFFICIAL_EVENTS.filter(evt => 
          evt.title.toLowerCase().includes(query) ||
          evt.venueName.toLowerCase().includes(query) ||
          evt.city.toLowerCase().includes(query) ||
          evt.description.toLowerCase().includes(query)
        );
        renderEvents(filtered);
      });
    }

    // Currency update listener
    window.addEventListener('currencychange', () => renderEvents(OFFICIAL_EVENTS));
  }

  function initExplorePage() {
    initHeader();
    initBottomNav('explore');

    const listContainer = document.getElementById('explore-events-list');
    const searchInput = document.getElementById('explore-search-input');
    const catPills = document.querySelectorAll('.cat-pill');
    let activeCat = 'all';

    function renderExplore() {
      if (!listContainer) return;
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

      const filtered = OFFICIAL_EVENTS.filter(evt => {
        const matchCat = (activeCat === 'all' || evt.category === activeCat);
        const matchQuery = !query || 
          evt.title.toLowerCase().includes(query) ||
          evt.venueName.toLowerCase().includes(query) ||
          evt.city.toLowerCase().includes(query);
        return matchCat && matchQuery;
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = '<div style="padding:32px; text-align:center; color:#6F776D; font-size:12px;">No matching events found.</div>';
        return;
      }

      listContainer.innerHTML = filtered.map(evt => `
        <article class="event-card">
          <div class="card-poster">
            <img src="${evt.posterUrl}" alt="${evt.title}" loading="lazy" onerror="this.src='${BRAND_POSTER}'" />
          </div>
          <div class="card-body">
            <h3 class="card-title">${evt.title}</h3>
            <p style="font-size:11px; color:#6F776D;">${evt.venueName} • ${evt.city}</p>
            <div class="card-footer">
              <span class="card-price-val">${formatPrice(evt.startingPriceUSD)}</span>
              <a href="checkout.html?event=${evt.id}" class="btn-primary">Buy Pass</a>
            </div>
          </div>
        </article>
      `).join('');
    }

    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCat = pill.getAttribute('data-cat') || 'all';
        renderExplore();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', renderExplore);
    }

    renderExplore();
    window.addEventListener('currencychange', renderExplore);
  }

  function initEventPage() {
    initHeader();
    initBottomNav('home');

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id') || 'evt-colour-run-2026';
    const evt = OFFICIAL_EVENTS.find(e => e.id === eventId) || OFFICIAL_EVENTS[0];

    const titleEl = document.getElementById('evt-detail-title');
    const heroImg = document.getElementById('evt-detail-hero');
    const dateEl = document.getElementById('evt-detail-date');
    const venueEl = document.getElementById('evt-detail-venue');
    const descEl = document.getElementById('evt-detail-desc');
    const tiersContainer = document.getElementById('evt-detail-tiers');
    const buyBtn = document.getElementById('evt-buy-btn');

    if (titleEl) titleEl.textContent = evt.title;
    if (heroImg) heroImg.src = evt.heroUrl || evt.posterUrl;
    if (dateEl) dateEl.textContent = new Date(evt.startDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (venueEl) venueEl.textContent = `${evt.venueName}, ${evt.venueAddress}`;
    if (descEl) descEl.textContent = evt.description;

    if (tiersContainer) {
      tiersContainer.innerHTML = evt.ticketTiers.map(t => `
        <div style="background:#FAF9F5; border:1px solid #E5DFD5; border-radius:14px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="font-size:13px; font-weight:800;">${t.name}</h4>
            <span style="font-size:10px; color:#169E65; font-weight:700;">${t.phaseLabel || 'Official Tier'}</span>
          </div>
          <span style="font-size:14px; font-weight:900;">${formatPrice(t.priceUSD)}</span>
        </div>
      `).join('');
    }

    if (buyBtn) {
      buyBtn.href = `checkout.html?event=${evt.id}`;
    }
  }

  function initCheckoutPage() {
    initHeader();
    initBottomNav('home');

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event') || 'evt-colour-run-2026';
    const evt = OFFICIAL_EVENTS.find(e => e.id === eventId) || OFFICIAL_EVENTS[0];

    const titleEl = document.getElementById('checkout-event-title');
    if (titleEl) titleEl.textContent = evt.title;

    let quantities = {};
    evt.ticketTiers.forEach((tier, idx) => {
      quantities[tier.id] = idx === 0 ? 1 : 0;
    });

    const tiersContainer = document.getElementById('checkout-tiers-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const submitBtn = document.getElementById('checkout-submit-btn');

    function updateOrderMath() {
      let subtotal = 0;
      let count = 0;
      evt.ticketTiers.forEach(t => {
        const qty = quantities[t.id] || 0;
        subtotal += t.priceUSD * qty;
        count += qty;
      });
      const fee = count > 0 ? 0.50 : 0;
      const total = subtotal + fee;

      if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
      if (totalEl) totalEl.textContent = formatPrice(total);
      if (submitBtn) {
        submitBtn.disabled = count === 0;
        submitBtn.textContent = `Pay with EcoCash (${formatPrice(total)})`;
      }
    }

    function renderTiers() {
      if (!tiersContainer) return;
      tiersContainer.innerHTML = evt.ticketTiers.map(tier => {
        const qty = quantities[tier.id] || 0;
        return `
          <div style="background:#FFFFFF; border:${qty > 0 ? '1.5px solid #20C982' : '1px solid #E5DFD5'}; border-radius:14px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:12px; font-weight:800; display:block;">${tier.name}</span>
              <span style="font-size:13px; font-weight:900; color:#20231F;">${formatPrice(tier.priceUSD)}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; background:#FAF9F5; border:1px solid #DDD6C8; border-radius:999px; padding:2px;">
              <button type="button" class="stepper-btn minus" data-id="${tier.id}" style="width:24px; height:24px; border-radius:50%; background:#EFECE6; font-weight:bold;">-</button>
              <span style="font-size:12px; font-weight:800; width:18px; text-align:center;">${qty}</span>
              <button type="button" class="stepper-btn plus" data-id="${tier.id}" style="width:24px; height:24px; border-radius:50%; background:#20C982; color:#fff; font-weight:bold;">+</button>
            </div>
          </div>
        `;
      }).join('');

      tiersContainer.querySelectorAll('.stepper-btn.minus').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          if (quantities[id] > 0) {
            quantities[id]--;
            renderTiers();
            updateOrderMath();
          }
        });
      });

      tiersContainer.querySelectorAll('.stepper-btn.plus').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          quantities[id] = (quantities[id] || 0) + 1;
          renderTiers();
          updateOrderMath();
        });
      });
    }

    renderTiers();
    updateOrderMath();

    // Populate user profile defaults
    const profile = getCustomerProfile();
    const phoneInput = document.getElementById('ecocash-phone-input');
    const nameInput = document.getElementById('attendee-name-input');
    const emailInput = document.getElementById('attendee-email-input');

    if (phoneInput && profile.phone) phoneInput.value = profile.phone;
    if (nameInput && profile.name) nameInput.value = profile.name;
    if (emailInput && profile.email) emailInput.value = profile.email;

    // Handle Form Submit & Simulated EcoCash Push Authorization
    const form = document.getElementById('checkout-form');
    const stepSelection = document.getElementById('checkout-step-selection');
    const stepAwaiting = document.getElementById('checkout-step-awaiting');
    const stepSuccess = document.getElementById('checkout-step-success');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = phoneInput.value.trim();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (stepSelection) stepSelection.style.display = 'none';
        if (stepAwaiting) {
          stepAwaiting.style.display = 'block';
          const maskedEl = document.getElementById('awaiting-masked-phone');
          if (maskedEl) maskedEl.textContent = maskPhone(phone);
        }

        // Simulate 2.5s mobile push confirmation
        setTimeout(() => {
          const rand = Math.floor(1000 + Math.random() * 9000);
          const orderRef = `SB-${rand}-HRE`;
          const tickets = [];

          evt.ticketTiers.forEach(t => {
            const count = quantities[t.id] || 0;
            for (let i = 0; i < count; i++) {
              tickets.push({
                ticketId: `TKT-${rand}-${String(tickets.length + 1).padStart(2, '0')}`,
                orderReference: orderRef,
                eventId: evt.id,
                eventTitle: evt.title,
                tierName: t.name,
                holderName: i === 0 ? name : `${name} (Guest ${i + 1})`,
                entryStatus: 'VALID',
                priceUSD: t.priceUSD
              });
            }
          });

          const newOrder = {
            id: orderRef,
            eventId: evt.id,
            eventTitle: evt.title,
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            totalUSD: evt.ticketTiers.reduce((acc, t) => acc + (t.priceUSD * (quantities[t.id] || 0)), 0) + 0.50,
            currency: getCurrency(),
            paymentMethod: 'ecocash_merchant',
            paymentStatus: 'verified',
            createdAt: new Date().toISOString(),
            tickets: tickets
          };

          const existingOrders = getOrders();
          existingOrders.unshift(newOrder);
          saveOrders(existingOrders);

          if (stepAwaiting) stepAwaiting.style.display = 'none';
          if (stepSuccess) {
            stepSuccess.style.display = 'block';
            const refEl = document.getElementById('success-order-ref');
            if (refEl) refEl.textContent = orderRef;
          }
        }, 2600);
      });
    }
  }

  function initTicketsPage() {
    initHeader();
    initBottomNav('tickets');

    const ticketsList = document.getElementById('my-tickets-list');
    const qrModal = document.getElementById('qr-pass-modal');
    const qrCloseBtn = document.getElementById('qr-modal-close-btn');
    const qrContainer = document.getElementById('qr-code-svg-box');
    const qrTitle = document.getElementById('qr-modal-title');
    const qrRef = document.getElementById('qr-modal-ref');
    const qrHolder = document.getElementById('qr-modal-holder');

    function renderTickets(filter) {
      if (!ticketsList) return;
      const all = getAllTickets();
      const filtered = all.filter(t => {
        if (filter === 'valid') return t.entryStatus === 'VALID';
        if (filter === 'checked_in') return t.entryStatus === 'CHECKED_IN';
        return true;
      });

      if (filtered.length === 0) {
        ticketsList.innerHTML = `
          <div style="background:#FAF9F5; border:1px solid #E5DFD5; border-radius:18px; padding:28px; text-align:center;">
            <p style="font-size:13px; font-weight:800; color:#20231F;">No Digital Passes Found</p>
            <p style="font-size:11px; color:#6F776D; margin-top:4px;">Book tickets or restore an existing pass using your booking reference.</p>
            <a href="index.html" class="btn-primary" style="margin-top:14px; display:inline-flex;">Discover Events</a>
          </div>`;
        return;
      }

      ticketsList.innerHTML = filtered.map(t => `
        <article class="ticket-card">
          <div class="ticket-header">
            <div>
              <span style="font-size:10px; font-mono; font-weight:bold; color:#6F776D;">${t.ticketId}</span>
              <h4 style="font-size:13px; font-weight:900; color:#20231F;">${t.tierName}</h4>
            </div>
            <span class="ticket-entry-status ${t.entryStatus === 'VALID' ? 'valid' : 'checked-in'}">
              ${t.entryStatus === 'VALID' ? '● Ready for Gate' : '✓ Checked In'}
            </span>
          </div>
          <div class="ticket-body">
            <div>
              <span style="font-size:10.5px; color:#6F776D; display:block;">Event</span>
              <span style="font-size:12px; font-weight:800; color:#20231F;">${t.eventTitle}</span>
            </div>
            <div>
              <span style="font-size:10.5px; color:#6F776D; display:block;">Attendee</span>
              <span style="font-size:12px; font-weight:700; color:#20231F;">${t.holderName}</span>
            </div>
            <button type="button" class="btn-primary open-qr-btn" data-ticket-id="${t.ticketId}" style="width:100%; margin-top:4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Present QR Pass</span>
            </button>
          </div>
        </article>
      `).join('');

      ticketsList.querySelectorAll('.open-qr-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tid = btn.getAttribute('data-ticket-id');
          const ticket = all.find(t => t.ticketId === tid);
          if (ticket && qrModal && qrContainer) {
            qrContainer.innerHTML = createQRCodeSVG(`SELEKTA_BASE:${ticket.ticketId}:${ticket.orderReference}:${ticket.entryStatus}`);
            if (qrTitle) qrTitle.textContent = ticket.eventTitle;
            if (qrRef) qrRef.textContent = ticket.ticketId;
            if (qrHolder) qrHolder.textContent = ticket.holderName;
            qrModal.classList.add('open');
          }
        });
      });
    }

    renderTickets('all');

    if (qrCloseBtn && qrModal) {
      qrCloseBtn.addEventListener('click', () => qrModal.classList.remove('open'));
    }

    // Filter Buttons
    document.querySelectorAll('.ticket-filter-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.ticket-filter-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        renderTickets(b.getAttribute('data-filter') || 'all');
      });
    });
  }

  function initAccountPage() {
    initHeader();
    initBottomNav('account');

    // 1. Profile Display & Edit
    const profile = getCustomerProfile();
    const nameEl = document.getElementById('account-profile-name');
    const phoneEl = document.getElementById('account-profile-phone');
    const emailEl = document.getElementById('account-profile-email');
    const editBtn = document.getElementById('account-profile-edit-btn');
    const editBox = document.getElementById('account-profile-edit-box');
    const displayBox = document.getElementById('account-profile-display-box');
    const editForm = document.getElementById('account-edit-form');
    const cancelBtn = document.getElementById('account-edit-cancel-btn');

    function syncProfile() {
      const p = getCustomerProfile();
      if (nameEl) nameEl.textContent = p.name || 'Guest Attendee';
      if (phoneEl) phoneEl.textContent = maskPhone(p.phone);
      if (emailEl) emailEl.textContent = p.email || 'No email registered';
    }

    syncProfile();

    if (editBtn && editBox && displayBox) {
      editBtn.addEventListener('click', () => {
        const p = getCustomerProfile();
        document.getElementById('edit-name-input').value = p.name || '';
        document.getElementById('edit-phone-input').value = p.phone || '';
        document.getElementById('edit-email-input').value = p.email || '';
        displayBox.style.display = 'none';
        editBox.style.display = 'block';
      });
    }

    if (cancelBtn && editBox && displayBox) {
      cancelBtn.addEventListener('click', () => {
        editBox.style.display = 'none';
        displayBox.style.display = 'flex';
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveCustomerProfile({
          name: document.getElementById('edit-name-input').value.trim(),
          phone: document.getElementById('edit-phone-input').value.trim(),
          email: document.getElementById('edit-email-input').value.trim()
        });
        editBox.style.display = 'none';
        displayBox.style.display = 'flex';
        syncProfile();
      });
    }

    // 2. Currency Selector
    const usdBtn = document.getElementById('currency-btn-usd');
    const zigBtn = document.getElementById('currency-btn-zig');

    function updateCurrencyUI() {
      const cur = getCurrency();
      if (usdBtn && zigBtn) {
        if (cur === 'USD') {
          usdBtn.classList.add('active');
          zigBtn.classList.remove('active');
        } else {
          zigBtn.classList.add('active');
          usdBtn.classList.remove('active');
        }
      }
    }

    if (usdBtn) usdBtn.addEventListener('click', () => { setCurrency('USD'); updateCurrencyUI(); });
    if (zigBtn) zigBtn.addEventListener('click', () => { setCurrency('ZiG'); updateCurrencyUI(); });
    updateCurrencyUI();

    // 3. Offline Cache Status
    const offlineCountEl = document.getElementById('offline-pass-count');
    if (offlineCountEl) {
      const tickets = getAllTickets();
      offlineCountEl.textContent = `${tickets.length} digital passes cached for offline presentation`;
    }

    // 4. Staff Scanner Auth Modal
    const staffModal = document.getElementById('staff-auth-modal');
    const staffLaunchBtn = document.getElementById('launch-staff-scanner-btn');
    const staffCloseBtn = document.getElementById('staff-modal-close-btn');
    const staffForm = document.getElementById('staff-pin-form');

    if (staffLaunchBtn && staffModal) {
      staffLaunchBtn.addEventListener('click', () => staffModal.classList.add('open'));
    }
    if (staffCloseBtn && staffModal) {
      staffCloseBtn.addEventListener('click', () => staffModal.classList.remove('open'));
    }
    if (staffForm) {
      staffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'scan.html';
      });
    }

    // 5. Reset Data Confirmation Modal
    const resetModal = document.getElementById('reset-confirm-modal');
    const resetOpenBtn = document.getElementById('reset-demo-open-btn');
    const resetCloseBtn = document.getElementById('reset-modal-close-btn');
    const resetConfirmBtn = document.getElementById('reset-modal-confirm-btn');

    if (resetOpenBtn && resetModal) {
      resetOpenBtn.addEventListener('click', () => resetModal.classList.add('open'));
    }
    if (resetCloseBtn && resetModal) {
      resetCloseBtn.addEventListener('click', () => resetModal.classList.remove('open'));
    }
    if (resetConfirmBtn) {
      resetConfirmBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY_ORDERS);
        localStorage.removeItem(STORAGE_KEY_PROFILE);
        resetModal.classList.remove('open');
        window.location.reload();
      });
    }

    // 6. Expandable FAQs
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        if (content) {
          content.classList.toggle('open');
        }
      });
    });
  }

  function initOrganiserPage() {
    initHeader();
    initBottomNav('home');

    const orders = getOrders();
    const allTickets = getAllTickets();
    const validCount = allTickets.filter(t => t.entryStatus === 'VALID').length;
    const checkedInCount = allTickets.filter(t => t.entryStatus === 'CHECKED_IN').length;
    const totalRevenueUSD = orders.reduce((sum, o) => sum + (o.totalUSD || 0), 0);

    const revEl = document.getElementById('org-revenue-usd');
    const ticketsEl = document.getElementById('org-tickets-sold');
    const rateEl = document.getElementById('org-checkin-rate');
    const ordersTable = document.getElementById('org-orders-body');

    if (revEl) revEl.textContent = formatPrice(totalRevenueUSD);
    if (ticketsEl) ticketsEl.textContent = allTickets.length;
    if (rateEl) {
      const pct = allTickets.length > 0 ? ((checkedInCount / allTickets.length) * 100).toFixed(0) : 0;
      rateEl.textContent = `${pct}% (${checkedInCount}/${allTickets.length})`;
    }

    if (ordersTable) {
      ordersTable.innerHTML = orders.map(o => `
        <tr style="border-bottom:1px solid #E5DFD5; font-size:11.5px;">
          <td style="padding:10px 8px; font-mono; font-weight:bold;">${o.id}</td>
          <td style="padding:10px 8px;">${o.customerName}</td>
          <td style="padding:10px 8px; font-weight:800;">${o.tickets.length}</td>
          <td style="padding:10px 8px; font-weight:bold; color:#128E5B;">${formatPrice(o.totalUSD)}</td>
          <td style="padding:10px 8px;"><span style="background:#E8F9F2; color:#128E5B; font-size:9px; font-weight:900; padding:2px 6px; border-radius:999px;">PAID</span></td>
        </tr>
      `).join('');
    }
  }

  function initScanPage() {
    const statusBox = document.getElementById('scan-status-alert');
    const input = document.getElementById('manual-ticket-input');
    const checkBtn = document.getElementById('manual-check-btn');
    const totalValidEl = document.getElementById('scan-stat-valid');
    const totalCheckedEl = document.getElementById('scan-stat-checked');

    function updateStats() {
      const tickets = getAllTickets();
      const valid = tickets.filter(t => t.entryStatus === 'VALID').length;
      const checked = tickets.filter(t => t.entryStatus === 'CHECKED_IN').length;
      if (totalValidEl) totalValidEl.textContent = valid;
      if (totalCheckedEl) totalCheckedEl.textContent = checked;
    }

    updateStats();

    function validateCode(code) {
      if (!code) return;
      const clean = code.trim().toUpperCase();
      const orders = getOrders();
      let matchedTicket = null;
      let matchedOrder = null;

      for (const ord of orders) {
        for (const t of ord.tickets) {
          if (t.ticketId.toUpperCase() === clean || clean.includes(t.ticketId.toUpperCase())) {
            matchedTicket = t;
            matchedOrder = ord;
            break;
          }
        }
        if (matchedTicket) break;
      }

      if (!statusBox) return;

      if (!matchedTicket) {
        statusBox.style.display = 'block';
        statusBox.style.background = '#FEE2E2';
        statusBox.style.borderColor = '#FCA5A5';
        statusBox.style.color = '#B91C1C';
        statusBox.innerHTML = `<strong>✗ Invalid Pass</strong><br>Code "${clean}" is not registered in Selekta Base database.`;
        return;
      }

      if (matchedTicket.entryStatus === 'CHECKED_IN') {
        statusBox.style.display = 'block';
        statusBox.style.background = '#FEF3C7';
        statusBox.style.borderColor = '#FCD34D';
        statusBox.style.color = '#B45309';
        statusBox.innerHTML = `<strong>⚠ Duplicate Entry Detected</strong><br>${matchedTicket.holderName} was already checked in. Gate re-entry prohibited.`;
        return;
      }

      // Mark as VALID -> CHECKED_IN
      matchedTicket.entryStatus = 'CHECKED_IN';
      saveOrders(orders);
      updateStats();

      statusBox.style.display = 'block';
      statusBox.style.background = '#E8F9F2';
      statusBox.style.borderColor = '#20C982';
      statusBox.style.color = '#128E5B';
      statusBox.innerHTML = `<strong>✓ Pass Validated — Access Granted</strong><br>${matchedTicket.holderName} • ${matchedTicket.tierName} (${matchedTicket.eventTitle})`;
    }

    if (checkBtn && input) {
      checkBtn.addEventListener('click', () => {
        validateCode(input.value);
        input.value = '';
      });
    }

    // Auto-scan simulation button
    const testScanBtn = document.getElementById('simulate-scan-btn');
    if (testScanBtn) {
      testScanBtn.addEventListener('click', () => {
        const tickets = getAllTickets();
        const validTicket = tickets.find(t => t.entryStatus === 'VALID');
        if (validTicket) {
          validateCode(validTicket.ticketId);
        } else if (tickets[0]) {
          validateCode(tickets[0].ticketId);
        }
      });
    }
  }

  // --- Router & DOM Ready Dispatcher ---
  document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker and ensure cache freshness
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        registration.update();
      }).catch(err => {
        console.warn('SW registration skipped:', err);
      });
    }

    // Proactively clean legacy caches from earlier versions
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          if (key !== 'selektabase-v6-static') {
            caches.delete(key);
          }
        });
      }).catch(() => {});
    }

    // Handle browser back and forward navigation
    window.addEventListener('popstate', (e) => {
      const currentPath = window.location.pathname.toLowerCase();
      let targetPage = 'home';
      if (currentPath.includes('explore')) targetPage = 'explore';
      else if (currentPath.includes('tickets')) targetPage = 'tickets';
      else if (currentPath.includes('account')) targetPage = 'account';

      navigateToPage(window.location.pathname, targetPage, false);
    });

    const path = window.location.pathname.toLowerCase();

    if (path.includes('explore')) {
      initExplorePage();
    } else if (path.includes('event')) {
      initEventPage();
    } else if (path.includes('tickets')) {
      initTicketsPage();
    } else if (path.includes('checkout')) {
      initCheckoutPage();
    } else if (path.includes('account')) {
      initAccountPage();
    } else if (path.includes('organiser')) {
      initOrganiserPage();
    } else if (path.includes('scan')) {
      initScanPage();
    } else {
      initIndexPage();
    }
  });

  // Export functions to global scope for inline button handlers
  window.Selekta = {
    getCurrency,
    setCurrency,
    formatPrice,
    getOrders,
    saveOrders,
    createQRCodeSVG
  };
})();
