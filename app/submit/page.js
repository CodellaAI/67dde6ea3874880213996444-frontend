
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

export default function SubmitPost() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities`);
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`, 
        data,
        { withCredentials: true }
      );
      router.push(`/r/${data.community}/${response.data._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Create a post</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Choose a community</label>
            <select 
              className="input-field"
              {...register('community', { required: 'Please select a community' })}
            >
              <option value="">Select a community</option>
              {communities.map(community => (
                <option key={community._id} value={community.name}>
                  r/{community.name}
                </option>
              ))}
            </select>
            {errors.community && (
              <p className="text-red-500 text-sm mt-1">{errors.community.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="Title" 
              {...register('title', { 
                required: 'Title is required',
                maxLength: {
                  value: 300,
                  message: 'Title cannot exceed 300 characters'
                }
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Text (optional)</label>
            <textarea 
              className="input-field min-h-[200px]"
              placeholder="Text (optional)" 
              {...register('content')}
            ></textarea>
          </div>
          
          <div>
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
