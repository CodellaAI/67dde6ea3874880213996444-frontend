
'use client';

import Link from 'next/link';
import { FaReddit, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="bg-reddit-blue p-3 text-white font-bold">
          Home
        </div>
        <div className="p-3">
          <p className="text-sm mb-4">
            Your personal Reddit frontpage. Come here to check in with your favorite communities.
          </p>
          
          <div className="space-y-2">
            <Link href="/submit" className="btn-primary w-full flex items-center justify-center">
              <FaPlus className="mr-2" />
              Create Post
            </Link>
            
            <Link href="/create-community" className="btn-secondary w-full flex items-center justify-center">
              <FaPlus className="mr-2" />
              Create Community
            </Link>
          </div>
        </div>
      </div>
      
      <div className="card p-3">
        <h3 className="font-medium mb-2">Reddit Premium</h3>
        <p className="text-sm mb-3">
          The best Reddit experience, with monthly Coins
        </p>
        <button className="btn-primary w-full">
          Try Now
        </button>
      </div>
      
      <div className="card p-3">
        <h3 className="font-medium mb-2">Reddit Rules</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Remember the human</li>
          <li>Behave like you would in real life</li>
          <li>Look for the original source of content</li>
          <li>Search for duplicates before posting</li>
          <li>Read the community's rules</li>
        </ul>
      </div>
      
      <div className="card p-3 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
          <Link href="#" className="hover:underline">Help</Link>
          <Link href="#" className="hover:underline">Reddit Coins</Link>
          <Link href="#" className="hover:underline">Reddit Premium</Link>
          <Link href="#" className="hover:underline">Communities</Link>
          <Link href="#" className="hover:underline">About</Link>
          <Link href="#" className="hover:underline">Careers</Link>
          <Link href="#" className="hover:underline">Press</Link>
          <Link href="#" className="hover:underline">Advertise</Link>
          <Link href="#" className="hover:underline">Blog</Link>
          <Link href="#" className="hover:underline">Terms</Link>
          <Link href="#" className="hover:underline">Content Policy</Link>
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <Link href="#" className="hover:underline">Mod Policy</Link>
        </div>
        <p>Reddit Inc © 2023. All rights reserved.</p>
      </div>
    </div>
  );
}
