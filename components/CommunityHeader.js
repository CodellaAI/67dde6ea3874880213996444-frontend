
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaReddit } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function CommunityHeader({ communityName }) {
  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${communityName}`,
          { withCredentials: true }
        );
        setCommunity(response.data);
        setIsJoined(response.data.isJoined);
      } catch (err) {
        setError('Failed to load community. It may have been deleted or does not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [communityName]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setIsJoining(true);
    try {
      const endpoint = isJoined ? 'leave' : 'join';
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${communityName}/${endpoint}`,
        {},
        { withCredentials: true }
      );
      setIsJoined(!isJoined);
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white h-32 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white h-32 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="h-20 bg-reddit-blue"></div>
      <div className="bg-white">
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="flex items-end absolute -top-4">
            <div className="w-16 h-16 rounded-full bg-white p-1 mr-4">
              {community.icon ? (
                <Image 
                  src={community.icon} 
                  alt={community.name} 
                  width={64} 
                  height={64} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-reddit-orange rounded-full flex items-center justify-center">
                  <FaReddit className="text-white text-3xl" />
                </div>
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold">r/{community.name}</h1>
              <p className="text-sm text-gray-500">r/{community.name}</p>
            </div>
            <div className="ml-4 pb-2">
              <button 
                className={`px-4 py-1 rounded-full font-medium ${
                  isJoined 
                    ? 'bg-white text-reddit-blue border border-reddit-blue hover:bg-gray-100' 
                    : 'bg-reddit-blue text-white hover:bg-blue-600'
                }`}
                onClick={handleJoin}
                disabled={isJoining}
              >
                {isJoining ? 'Processing...' : isJoined ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
          <div className="h-16"></div>
        </div>
      </div>
    </div>
  );
}
