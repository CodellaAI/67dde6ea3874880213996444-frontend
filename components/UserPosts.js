
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import LoadingSpinner from './LoadingSpinner';

export default function UserPosts({ username }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}/posts`
        );
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load user posts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
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

  if (posts.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500">u/{username} hasn't posted anything yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
