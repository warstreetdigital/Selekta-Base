import React from 'react';
import { useTicketContext, NavTab } from '../context/TicketContext';
import { Home, Compass, Ticket, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, allTickets } = useTicketContext();

  const validTicketsCount = allTickets.filter(t => t.entryStatus === 'VALID').length;

  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/96 backdrop-blur-lg border-t border-[#E8E2D6] shadow-[0_-2px_12px_rgba(32,35,31,0.04)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group relative flex flex-col items-center justify-center py-0.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'text-[#169E65] -translate-y-0.5' 
                  : 'text-[#6F776D] hover:text-[#20231F]'
              }`}
            >
              {/* Active Pill Highlight with subtle emerald glow */}
              <div 
                className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#20C982]/12 shadow-[inset_0_0_0_1px_rgba(32,201,130,0.22)]' 
                    : 'bg-transparent hover:bg-black/[0.02]'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[#169E65] stroke-[2.3] scale-105' : 'stroke-[#6F776D] stroke-[1.8] group-hover:scale-105'}`} />
                  {tab.id === 'tickets' && validTicketsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1.5 min-w-[16px] h-4 rounded-full bg-[#20C982] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                      {validTicketsCount}
                    </span>
                  )}
                </div>

                <span className={`text-[10.5px] mt-0.5 transition-colors tracking-tight ${isActive ? 'font-black text-[#128E5B]' : 'font-semibold text-[#6F776D]'}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

