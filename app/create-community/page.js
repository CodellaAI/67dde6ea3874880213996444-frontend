
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

export default function CreateCommunity() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const communityName = watch('name', '');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/communities`, 
        data,
        { withCredentials: true }
      );
      
      router.push(`/r/${data.name}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Create a community</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Name</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">r/</span>
              <input 
                type="text" 
                className="input-field"
                {...register('name', { 
                  required: 'Community name is required',
                  minLength: {
                    value: 3,
                    message: 'Community name must be at least 3 characters'
                  },
                  maxLength: {
                    value: 21,
                    message: 'Community name cannot exceed 21 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Community names can only contain letters, numbers, and underscores'
                  }
                })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Community names including capitalization cannot be changed.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Community description</label>
            <textarea 
              className="input-field"
              rows="4"
              {...register('description', { 
                required: 'Community description is required',
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters'
                }
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Community type</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="public" 
                  value="public"
                  className="mr-2"
                  defaultChecked
                  {...register('type')}
                />
                <label htmlFor="public">
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-gray-500">Anyone can view, post, and comment</div>
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="restricted" 
                  value="restricted"
                  className="mr-2"
                  {...register('type')}
                />
                <label htmlFor="restricted">
                  <div className="font-medium">Restricted</div>
                  <div className="text-sm text-gray-500">Anyone can view, but only approved users can post</div>
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="private" 
                  value="private"
                  className="mr-2"
                  {...register('type')}
                />
                <label htmlFor="private">
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-gray-500">Only approved users can view and post</div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
