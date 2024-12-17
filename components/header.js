"use client";
import { useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X , Home, ShoppingBasket, Tag, FeedBa} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartContext } from './cart/CartContext';
import axios from 'axios';
import Image from 'next/image';
const iconSize = 20
const navItems = [
  { href: '/', label: 'Home', icon: <Home size={iconSize} />},
  { href: '/products', label: 'Products', icon: <ShoppingBasket size={iconSize} /> },
  { href: '/categories', label: 'Categories', icon: <Tag size={iconSize} />},
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHomeRoute, setIsHomeRoute] = useState(false);
  const [preferences, setPreferences] = useState({
    name: "Shop it",
    icon: "https://cdn-icons-png.flaticon.com/512/126/126122.png"
  })

  const route = useRouter();

  useEffect(() => {
    if (route.pathname === "/") {
      setIsHomeRoute(true);
    } else {
      setIsHomeRoute(false);
    }
  }, [route]);

  useEffect(() => {
    const getPreferencesForShop = async () => {
      const preferencesResponse = await axios.get("/api/get_preferenses")
      setPreferences(preferencesResponse.data)

    }
    getPreferencesForShop()
  },[])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //* get the cart data here
  const { cartProducts } = useContext(CartContext);

  const handleImageError = () => {
    setImageError(true); // Set imageError to true when image fails to load
  };

  const ProfileButton = () => {
    const { data: session } = useSession()

    //* return the according widget
    if (session) {
      return (<Link
        href="/profile"
        className={`flex gap-1 ${
          isHomeRoute || route.pathname === "/products" ? "text-white hover:text-gray-400" : "text-gray-700 hover:text-gray-900"
        }`}
      >
        <div className='flex gap-2 items-center'>
        {session.user.image && !imageError
          ? <Image width={150} height={150} src={session.user.image} className='w-8 h-8 rounded-full' alt='' onError={handleImageError} />
          : <div className='w-8 h-8 bg-indigo-800 bg-opacity-35 items-center flex justify-center rounded-full text-white'>
            {session.user.name[0].toUpperCase()}
            </div>}
          <div className='md:flex hidden'>
        {session.user.name}
          </div>
        </div>
      </Link>)
    } else {
      return (
        <button
            onClick={() => signIn("google")}
            className={`flex gap-1 ${
              isHomeRoute || route.pathname === "/products" ? "text-white hover:text-gray-400" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <User className="w-6 h-6" /> Sign in
          </button>
      )
    }
  }

  return (
    <header
      className={`shadow-sm w-full z-50 absolute ${
        isHomeRoute || route.pathname === "/products"
          ? "bg-transparent text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div>
          <Link href="/" className="text-2xl font-bold flex gap-2 text-center align-middle justify-center">
            <Image width={150} height={150} src={preferences.icon} className='w-9 h-9 rounded-full' alt=''/>
            <div className='md:text-base text-sm text-center items-center align-middle flex'>
              <h1>
              {preferences.name}
              </h1>
            </div>
          </Link>
        </div>

        {/* Navigation Menu (Desktop) */}
        <div className="hidden sm:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`font-medium flex gap-2 ${
                isHomeRoute || route.pathname === "/products"
                  ? "text-white hover:text-gray-400"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Account and Cart */}
        <div className="flex items-center space-x-4">
        <ProfileButton />
          <Link
            href="/cart"
            className={`relative ${
              isHomeRoute || route.pathname === "/products" ? "text-white hover:text-gray-400" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartProducts.length > 0? <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium">
              {cartProducts.length}
            </span> : null}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button
            type="button"
            className=" rounded-md p-2 inline-flex items-center justify-center text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden shadow-md ">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${isHomeRoute? "bg-black/80 text-white" : "bg-white/80 text-black"}`}>
            {navItems.map((item, index) => (
              <Link
                onClick={()=> setIsMenuOpen(!isMenuOpen)}
                key={index}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  (isHomeRoute || route.pathname === "/products")
                    ? " hover:bg-gray-800"
                    : " hover:bg-gray-100 hover:text-gray-900"
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