
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaReddit, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

export default function TopCommunities() {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/communities/top`
        );
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunities();
  }, []);
  
  if (isLoading) {
    return (
      <div className="card p-4 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (communities.length === 0) {
    return null;
  }
  
  return (
    <div className="card overflow-hidden">
      <div className="bg-reddit-blue p-3 text-white font-bold">
        Top Communities
      </div>
      <div className="py-2">
        {communities.map((community, index) => (
          <Link 
            key={community._id}
            href={`/r/${community.name}`}
            className="flex items-center px-4 py-2 hover:bg-gray-100"
          >
            <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
            <FaChevronUp className="text-green-500 mr-2" />
            {community.icon ? (
              <Image 
                src={community.icon} 
                alt={community.name} 
                width={24} 
                height={24} 
                className="rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-reddit-orange rounded-full flex items-center justify-center mr-2">
                <FaReddit className="text-white text-sm" />
              </div>
            )}
            <span className="font-medium">r/{community.name}</span>
          </Link>
        ))}
        <div className="px-4 py-3 border-t">
          <Link href="/communities" className="btn-primary w-full text-center block">
            View All Communities
          </Link>
        </div>
      </div>
    </div>
  );
}
