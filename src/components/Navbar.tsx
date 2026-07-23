import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, MessageSquareText, Info, Menu, X, Target } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Search },
    { id: 'investigate', label: 'Investigate', icon: Sparkles, highlight: true },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'teachme', label: 'Teach Me Mode', icon: MessageSquareText },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavClick('home')}
            id="nav-logo"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-base leading-none">🔎</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  MathDetective <span className="text-indigo-600">AI</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500" id="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 py-5 transition-all duration-150 border-b-2 ${
                    isActive
                      ? 'text-indigo-600 border-indigo-600 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-indigo-600'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Badge & CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right leading-none border-r border-slate-200 pr-4">
              <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">STATUS</div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </div>
            </div>
            <button
              onClick={() => handleNavClick('investigate')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 active:scale-[0.98] transition-all"
              id="header-cta-button"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              INVESTIGATE
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2" id="mobile-nav-drawer">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('investigate')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-100"
            >
              <Sparkles className="w-4 h-4" />
              INVESTIGATE SOLUTION
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
