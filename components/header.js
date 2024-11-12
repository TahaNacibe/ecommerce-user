"use client";
import { useEffect, useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomeRoute, setIsHomeRoute] = useState(false);

  const route = useRouter();

  useEffect(() => {
    if (route.pathname === "/") {
      setIsHomeRoute(true);
    } else {
      setIsHomeRoute(false);
    }
  }, [route]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`shadow-sm w-full z-50 absolute ${
        isHomeRoute
          ? "bg-transparent text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div>
          <Link href="/" className="text-2xl font-bold">
            ShopName
          </Link>
        </div>

        {/* Navigation Menu (Desktop) */}
        <div className="hidden sm:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`font-medium ${
                isHomeRoute
                  ? "text-white hover:text-gray-400"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Account and Cart */}
        <div className="flex items-center space-x-4">
          <Link
            href="/account"
            className={`${
              isHomeRoute ? "text-white hover:text-gray-400" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <User className="w-6 h-6" />
          </Link>
          <Link
            href="/cart"
            className={`relative ${
              isHomeRoute ? "text-white hover:text-gray-400" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium">
              2
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button
            type="button"
            className="bg-gray-100 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isHomeRoute
                    ? "text-white bg-black hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}