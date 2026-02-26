import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Search, Menu, X, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { isAuthenticated, login, logout, isLoggingIn } = useAuth();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/catalog', search: { search: searchQuery.trim(), category: '' } });
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: 'Shop', to: '/catalog' as const },
    { label: 'Blog', to: '/blog' as const },
    { label: 'About', to: '/about' as const },
    { label: 'Contact', to: '/contact' as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-medanta-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/assets/generated/medanta-logo.dim_200x60.png"
              alt="MEDANTA CARE"
              className="h-10 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-white font-display font-bold text-xl">
              <span className="text-medanta-orange">MEDANTA</span> CARE
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search medicines, categories..."
                className="w-full pl-4 pr-10 py-2 rounded-full bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-medanta-orange focus:bg-white/15 text-sm transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-medanta-orange transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/80 hover:text-medanta-orange text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Cart */}
            <Link to="/cart" className="relative text-white/80 hover:text-medanta-orange transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-medanta-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-medanta-orange flex items-center justify-center text-white font-bold text-sm">
                    {userProfile?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{userProfile?.name ?? 'User'}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-medanta-grey transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={14} />
                      My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-medanta-purple hover:bg-medanta-grey transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                disabled={isLoggingIn}
                className="bg-medanta-orange text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            )}
          </nav>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative text-white/80">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-medanta-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-4 pr-10 py-2 rounded-full bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                <Search size={16} />
              </button>
            </form>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-white/80 hover:text-medanta-orange text-sm font-medium py-1 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-white/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block text-medanta-purple text-sm py-1" onClick={() => setMobileOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-red-400 text-sm py-1">
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { login(); setMobileOpen(false); }}
                disabled={isLoggingIn}
                className="bg-medanta-orange text-white text-sm font-semibold px-4 py-2 rounded-full w-full"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
