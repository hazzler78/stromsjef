'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains('dark');
    if (nextIsDark) root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('theme', nextIsDark ? 'dark' : 'light'); } catch (e) {}
    setIsDark(nextIsDark);
  };

  return (
    <header className="fixed top-0 w-full bg-blue-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Logo width={32} height={40} className="text-white hover:text-blue-100 transition-colors" />
            <span className="text-2xl font-bold text-white !text-white">Strømsjef</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  href="/" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  Avtaler
                </Link>
              </li>
              <li>
                <Link 
                  href="/fakturakalkulator" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  Fakturakalkulator
                </Link>
              </li>
              <li>
                <Link 
                  href="/bedrift" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  For bedrifter
                </Link>
              </li>
              <li>
                <Link 
                  href="/ofte-stilte-sporsmal" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/om-oss" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  Om oss
                </Link>
              </li>
              <li>
                <Link 
                  href="/media" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  I media
                </Link>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - visible on mobile and desktop */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-800 transition-colors text-white text-sm"
              aria-label="Bytt tema"
            >
              {isDark ? 'Lyst tema' : 'Mørkt tema'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors text-white"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="md:hidden absolute top-full left-0 right-0 bg-blue-600 border-t border-blue-500 py-4 z-50 shadow-lg">
              <div className="container mx-auto px-4">
                <ul className="space-y-4">
                  <li>
                    <Link 
                      href="/" 
                      className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                      style={{ color: 'white' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Avtaler
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/fakturakalkulator" 
                      className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                      style={{ color: 'white' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Fakturakalkulator
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/bedrift" 
                      className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                      style={{ color: 'white' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      For bedrifter
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/ofte-stilte-sporsmal" 
                      className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                      style={{ color: 'white' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/om-oss" 
                      className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                      style={{ color: 'white' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Om oss
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/media" 
                      className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                      style={{ color: 'white' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      I media
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 