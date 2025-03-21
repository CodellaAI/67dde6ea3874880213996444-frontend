
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaReddit, FaBirthdayCake, FaUsers } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

export default function CommunityAbout({ communityName }) {
  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${communityName}`
        );
        setCommunity(response.data);
      } catch (err) {
        setError('Failed to load community information.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [communityName]);

  if (isLoading) {
    return (
      <div className="card p-4 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="bg-reddit-blue p-3 text-white font-bold">
        About Community
      </div>
      <div className="p-3">
        <p className="mb-4">{community.description}</p>
        
        <div className="flex items-center mb-3">
          <FaUsers className="text-gray-500 mr-2" />
          <div>
            <div className="font-medium">{community.memberCount || 0}</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <FaBirthdayCake className="text-gray-500 mr-2" />
          <div>
            <div className="font-medium">Created {moment(community.createdAt).format('MMM D, YYYY')}</div>
          </div>
        </div>
        
        <button className="btn-primary w-full">Create Post</button>
      </div>
      
      {community.rules && community.rules.length > 0 && (
        <div className="border-t p-3">
          <h3 className="font-medium mb-2">r/{community.name} Rules</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {community.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ol>
        </div>
      )}
      
      <div className="border-t p-3 text-sm">
        <div className="flex items-center justify-between mb-2">
          <span>Moderators</span>
          <button className="text-reddit-blue">Message the mods</button>
        </div>
        <div className="text-reddit-blue">
          <div>u/{community.creator.username}</div>
          {community.moderators && community.moderators.map(mod => (
            <div key={mod._id}>u/{mod.username}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
