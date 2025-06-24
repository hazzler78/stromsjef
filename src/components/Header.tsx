'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Logo width={32} height={40} />
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
                  Sammenlign
                </Link>
              </li>
              <li>
                <Link 
                  href="/spotpriskontroll" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  Spotpriskontroll
                </Link>
              </li>
              <li>
                <Link 
                  href="/business" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  For bedrifter
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-blue-500 py-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sammenlign
                </Link>
              </li>
              <li>
                <Link 
                  href="/spotpriskontroll" 
                  className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Spotpriskontroll
                </Link>
              </li>
              <li>
                <Link 
                  href="/business" 
                  className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For bedrifter
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="block py-2 text-white !text-white hover:!text-blue-100 transition-colors font-medium"
                  style={{ color: 'white' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 