/**
 * Selekta Base — Master Foundation PWA
 * Real Installable Event Discovery & Ticketing Platform for Zimbabwe
 */
import React, { useEffect } from 'react';
import { TicketProvider, useTicketContext } from './context/TicketContext';
import { Navigation } from './components/Navigation';
import { EventDetailModal } from './components/EventDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { GateScannerModal } from './components/GateScannerModal';
import { GuestRecoveryModal } from './components/GuestRecoveryModal';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { MyTicketsView } from './views/MyTicketsView';
import { AccountView } from './views/AccountView';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedEvent, 
    setSelectedEvent, 
    checkoutEvent, 
    setCheckoutEvent, 
    isScannerOpen, 
    setIsScannerOpen, 
    isRecoveryOpen, 
    setIsRecoveryOpen 
  } = useTicketContext();

  // Register service worker if in production or supported
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('SW registration skipped:', err);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#20231F] flex flex-col font-sans selection:bg-[#20C982]/20 selection:text-[#20231F]">
      {/* Main Content Area starting high on screen */}
      <main className="flex-1 w-full mx-auto px-3.5 pt-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'tickets' && <MyTicketsView />}
        {activeTab === 'account' && <AccountView />}
      </main>

      {/* Primary 4-Tab Navigation */}
      <Navigation />

      {/* Modals */}
      <EventDetailModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />

      <CheckoutModal 
        event={checkoutEvent} 
        onClose={() => setCheckoutEvent(null)} 
      />

      <GateScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
      />

      <GuestRecoveryModal 
        isOpen={isRecoveryOpen} 
        onClose={() => setIsRecoveryOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <TicketProvider>
      <MainAppContent />
    </TicketProvider>
  );
}
