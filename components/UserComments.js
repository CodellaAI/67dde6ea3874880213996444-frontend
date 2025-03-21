
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import CommentItem from './CommentItem';
import LoadingSpinner from './LoadingSpinner';

export default function UserComments({ username }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}/comments`
        );
        setComments(response.data);
      } catch (err) {
        setError('Failed to load user comments.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserComments();
  }, [username]);

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

  if (comments.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500">u/{username} hasn't commented on anything yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment._id} className="card p-4">
          <div className="text-xs text-gray-500 mb-2">
            <span>Comment on </span>
            <Link href={`/r/${comment.post.community}/${comment.post._id}`} className="text-reddit-blue hover:underline">
              {comment.post.title}
            </Link>
            <span> in </span>
            <Link href={`/r/${comment.post.community}`} className="text-reddit-blue hover:underline">
              r/{comment.post.community}
            </Link>
          </div>
          <CommentItem 
            comment={comment} 
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
          />
        </div>
      ))}
    </div>
  );
}
