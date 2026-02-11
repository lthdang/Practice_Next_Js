import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from '../UserMenu';
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setIsLoggedIn(true);
        // Check if user is super_admin (role_id === 1)
        setIsSuperAdmin(userData.role_id === 1);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg text-white font-bold text-xl shadow-lg">
              🎓
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Auth Section - Show UserMenu if logged in (non-super_admin), else show Login/Register buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn && !isSuperAdmin ? (
              <UserMenu />
            ) : !isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:transform hover:scale-105 shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
