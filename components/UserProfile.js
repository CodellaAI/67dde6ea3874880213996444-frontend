
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaReddit, FaBirthdayCake, FaCaretUp } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

export default function UserProfile({ username }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
        );
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user profile. User may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (isLoading) {
    return (
      <div className="card p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="h-20 bg-reddit-blue"></div>
      <div className="px-6 py-4 relative">
        <div className="absolute -top-10 left-6 w-20 h-20 rounded-full bg-white p-1">
          {user.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user.username} 
              width={80} 
              height={80} 
              className="rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-reddit-orange rounded-full flex items-center justify-center">
              <FaReddit className="text-white text-4xl" />
            </div>
          )}
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-bold">u/{user.username}</h1>
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <FaCaretUp className="text-reddit-orange mr-1" />
              <span>{user.karma || 0} karma</span>
            </div>
            <div className="flex items-center">
              <FaBirthdayCake className="mr-1" />
              <span>Cake day {moment(user.createdAt).format('MMMM D, YYYY')}</span>
            </div>
          </div>
          
          {user.bio && (
            <div className="mt-4 text-gray-700">
              {user.bio}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
