
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowUp, FaArrowDown, FaReply, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

export default function CommentItem({ comment, onDelete, onUpdate }) {
  const [votes, setVotes] = useState(comment.votes || 0);
  const [userVote, setUserVote] = useState(comment.userVote || 0);
  const [isVoting, setIsVoting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      content: comment.content
    }
  });
  const { user } = useAuth();
  
  const isAuthor = user && comment.author && user.username === comment.author.username;
  
  const handleVote = async (voteType) => {
    if (!user) return;
    
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      // If user clicks the same vote type again, remove their vote
      const newVoteValue = userVote === voteType ? 0 : voteType;
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment._id}/vote`,
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
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment._id}`,
          { withCredentials: true }
        );
        onDelete(comment._id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };
  
  const onSubmitEdit = async (data) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment._id}`,
        { content: data.content },
        { withCredentials: true }
      );
      
      onUpdate(comment._id, data.content);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  
  return (
    <div className="flex">
      {/* Vote buttons */}
      <div className="flex flex-col items-center mr-2">
        <button 
          className={`p-1 rounded ${userVote === 1 ? 'text-reddit-orange' : 'text-gray-400'} hover:text-reddit-orange hover:bg-gray-100`}
          onClick={() => handleVote(1)}
          disabled={isVoting}
        >
          <FaArrowUp className="text-xs" />
        </button>
        <span className={`text-xs font-semibold my-0.5 ${
          userVote === 1 ? 'text-reddit-orange' : 
          userVote === -1 ? 'text-blue-600' : 
          'text-gray-800'
        }`}>
          {votes}
        </span>
        <button 
          className={`p-1 rounded ${userVote === -1 ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-600 hover:bg-gray-100`}
          onClick={() => handleVote(-1)}
          disabled={isVoting}
        >
          <FaArrowDown className="text-xs" />
        </button>
      </div>
      
      {/* Comment content */}
      <div className="flex-1">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <Link href={`/user/${comment.author.username}`} className="font-medium text-gray-900 hover:underline">
            {comment.author.username}
          </Link>
          <span className="mx-1">•</span>
          <span>{moment(comment.createdAt).fromNow()}</span>
          {comment.isEdited && (
            <>
              <span className="mx-1">•</span>
              <span>edited</span>
            </>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmitEdit)}>
            <textarea
              className="input-field min-h-[100px] mb-2"
              {...register('content', { 
                required: 'Comment cannot be empty',
                maxLength: {
                  value: 10000,
                  message: 'Comment is too long'
                }
              })}
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mb-2">{errors.content.message}</p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-reddit-blue text-white text-sm rounded-full"
              >
                Save
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-gray-800 mb-2">
            {comment.content}
          </div>
        )}
        
        {/* Comment actions */}
        <div className="flex items-center text-xs text-gray-500">
          <button className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded">
            <FaReply className="mr-1" />
            <span>Reply</span>
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center hover:bg-gray-100 p-1 rounded"
              onClick={() => setShowActions(!showActions)}
            >
              <FaEllipsisH className="mr-1" />
            </button>
            
            {showActions && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                {isAuthor && (
                  <>
                    <button 
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowActions(false);
                        setIsEditing(true);
                      }}
                    >
                      <FaEdit className="mr-2" />
                      Edit Comment
                    </button>
                    <button 
                      className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setShowActions(false);
                        handleDelete();
                      }}
                    >
                      <FaTrash className="mr-2" />
                      Delete Comment
                    </button>
                  </>
                )}
                <button 
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
  );
}
