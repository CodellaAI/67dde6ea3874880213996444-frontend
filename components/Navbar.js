
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaReddit, FaSearch, FaPlus, FaUser, FaBell, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white fixed top-0 left-0 right-0 h-14 border-b border-gray-200 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-reddit-orange">
            <FaReddit className="text-3xl" />
            <span className="font-bold text-lg hidden sm:block">reddit</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-reddit-orange focus:border-reddit-orange"
              placeholder="Search Reddit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/submit" className="hidden sm:flex items-center gap-1 p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <FaPlus className="text-lg" />
                <span className="font-medium">Create</span>
              </Link>
              
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
                <FaBell className="text-xl" />
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                      <Image 
                        src={user?.avatar || "https://via.placeholder.com/40"} 
                        alt={user?.username || "User"} 
                        width={32} 
                        height={32} 
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden md:block font-medium">{user?.username}</span>
                  </div>
                  <FaChevronDown className="text-sm text-gray-500" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href={`/user/${user?.username}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link 
                      href="/create-community"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Create Community
                    </Link>
                    <button 
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary py-1.5 px-4">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary py-1.5 px-4">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
