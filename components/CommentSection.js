
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import CommentItem from './CommentItem';
import LoadingSpinner from './LoadingSpinner';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);
  
  const onSubmit = async (data) => {
    if (!isAuthenticated) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
        { content: data.comment },
        { withCredentials: true }
      );
      
      setComments(prev => [response.data, ...prev]);
      reset();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };
  
  const handleUpdateComment = (commentId, newContent) => {
    setComments(prev => 
      prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, content: newContent } 
          : comment
      )
    );
  };
  
  return (
    <div className="mt-4">
      {isAuthenticated ? (
        <div className="card p-4 mb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Comment as <span className="text-reddit-blue">{user?.username}</span>
              </label>
              <textarea
                className="input-field min-h-[100px]"
                placeholder="What are your thoughts?"
                {...register('comment', { 
                  required: 'Comment cannot be empty',
                  maxLength: {
                    value: 10000,
                    message: 'Comment is too long'
                  }
                })}
              ></textarea>
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card p-4 mb-4 text-center">
          <p className="text-gray-700 mb-2">Log in or sign up to leave a comment</p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn-secondary">Log In</a>
            <a href="/signup" className="btn-primary">Sign Up</a>
          </div>
        </div>
      )}
      
      <div className="card p-4">
        <h3 className="text-lg font-medium mb-4">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
