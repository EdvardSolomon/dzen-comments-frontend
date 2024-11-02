import React from "react";

const CommentSkeleton: React.FC = () => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4 mb-4 animate-pulse'>
      <div className='h-4 bg-gray-300 rounded w-1/3 mb-2'></div>
      <div className='h-3 bg-gray-200 rounded w-2/3 mb-4'></div>
      <div className='h-20 bg-gray-100 rounded'></div>
      <div className='h-4 bg-gray-300 rounded w-1/4 mt-4'></div>
    </div>
  );
};

export default CommentSkeleton;
