
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaShare, FaBookmark, FaEllipsisH } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function PostDetail({ postId, community }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
          { withCredentials: true }
        );
        setPost(response.data);
        setVotes(response.data.votes);
        setUserVote(response.data.userVote || 0);
      } catch (err) {
        setError('Failed to load post. It may have been deleted or does not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      // If user clicks the same vote type again, remove their vote
      const newVoteValue = userVote === voteType ? 0 : voteType;
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/vote`,
        { voteType: newVoteValue },
        { withCredentials: true }
      );
      
      setVotes(response.data.votes);
      setUserVote(newVoteValue);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
          { withCredentials: true }
        );
        router.push(`/r/${community}`);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
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

  const isAuthor = user && post.author && user.username === post.author.username;

  return (
    <div className="card mb-4">
      <div className="flex">
        {/* Vote buttons */}
        <div className="w-10 bg-gray-50 flex flex-col items-center p-2 rounded-l-md">
          <button 
            className={`p-1 rounded ${userVote === 1 ? 'text-reddit-orange' : 'text-gray-400'} hover:text-reddit-orange hover:bg-gray-200`}
            onClick={() => handleVote(1)}
            disabled={isVoting}
          >
            <FaArrowUp />
          </button>
          <span className={`text-xs font-semibold my-1 ${
            userVote === 1 ? 'text-reddit-orange' : 
            userVote === -1 ? 'text-blue-600' : 
            'text-gray-800'
          }`}>
            {votes}
          </span>
          <button 
            className={`p-1 rounded ${userVote === -1 ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-600 hover:bg-gray-200`}
            onClick={() => handleVote(-1)}
            disabled={isVoting}
          >
            <FaArrowDown />
          </button>
        </div>
        
        {/* Post content */}
        <div className="flex-1 p-4">
          {/* Post header */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            {post.communityIcon && (
              <Image 
                src={post.communityIcon} 
                alt={post.community} 
                width={20} 
                height={20} 
                className="rounded-full mr-1"
              />
            )}
            <Link href={`/r/${post.community}`} className="font-medium text-gray-900 hover:underline mr-1">
              r/{post.community}
            </Link>
            <span className="mx-1">•</span>
            <span>Posted by</span>
            <Link href={`/user/${post.author.username}`} className="hover:underline mx-1">
              u/{post.author.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{moment(post.createdAt).fromNow()}</span>
          </div>
          
          {/* Post title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h1>
          
          {/* Post content */}
          {post.content && (
            <div className="text-gray-800 mb-4 whitespace-pre-line">
              {post.content}
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center text-gray-500 text-sm border-t border-gray-100 pt-3">
            <button className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded">
              <FaCommentAlt className="mr-1 text-xs" />
              <span>{post.commentCount || 0} Comments</span>
            </button>
            
            <button className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded">
              <FaShare className="mr-1 text-xs" />
              <span>Share</span>
            </button>
            
            <button className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded">
              <FaBookmark className="mr-1 text-xs" />
              <span>Save</span>
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center hover:bg-gray-100 p-1 rounded"
                onClick={() => setShowActions(!showActions)}
              >
                <FaEllipsisH className="mr-1 text-xs" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  {isAuthor && (
                    <>
                      <Link 
                        href={`/edit-post/${postId}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowActions(false)}
                      >
                        Edit Post
                      </Link>
                      <button 
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          setShowActions(false);
                          handleDelete();
                        }}
                      >
                        Delete Post
                      </button>
                    </>
                  )}
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
