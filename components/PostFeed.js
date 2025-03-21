
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import PostCard from './PostCard';
import LoadingSpinner from './LoadingSpinner';

const fetcher = url => axios.get(url).then(res => res.data);

export default function PostFeed({ community = null }) {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const apiUrl = community 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/community/${community}?page=${page}&limit=10` 
    : `${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=${page}&limit=10`;
  
  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  
  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllPosts(data.posts);
      } else {
        setAllPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(data.hasMore);
    }
  }, [data, page]);
  
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 &&
        hasMore && 
        !isLoading
      ) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);
  
  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-500">Failed to load posts. Please try again later.</p>
      </div>
    );
  }
  
  if (isLoading && page === 1) {
    return (
      <div className="card p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (allPosts.length === 0 && !isLoading) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {allPosts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
      
      {isLoading && page > 1 && (
        <div className="card p-6 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
      
      {!hasMore && allPosts.length > 0 && (
        <div className="card p-6 text-center">
          <p className="text-gray-500">You've reached the end!</p>
        </div>
      )}
    </div>
  );
}
