import React from "react";
import NewCommentsButton from "./NewCommentsButton";
import useCommentsContainer from "../hooks/useCommentsContainer";
import CommentSkeleton from "./CommentSkeleton";

const CommentList: React.FC = () => {
  const {
    comments,
    currentPage,
    totalPages,
    loading,
    error,
    handleNextPage,
    handlePrevPage,
    handleSortChange,
    renderCommentTree,
    sortField,
    sortOrder,
  } = useCommentsContainer();

  if (loading) {
    return (
      <div className='comment-list mt-6'>
        {Array.from({ length: 10 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container text-center mt-6'>
        <p className='text-red-500 text-lg'>
          Error loading comments: {error.message}
        </p>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition'
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='comment-list-container'>
      <NewCommentsButton />
      <div className='sort-controls mt-4 flex justify-center gap-4'>
        <button
          className='bg-blue-300 px-4 py-2 rounded'
          onClick={() => handleSortChange("user_name")}
        >
          Sort by User Name{" "}
          {sortField === "user_name" &&
            (sortOrder === "asc" ? "\u2191" : "\u2193")}
        </button>
        <button
          className='bg-blue-300 px-4 py-2 rounded'
          onClick={() => handleSortChange("email")}
        >
          Sort by E-mail{" "}
          {sortField === "email" && (sortOrder === "asc" ? "\u2191" : "\u2193")}
        </button>
        <button
          className='bg-blue-300 px-4 py-2 rounded'
          onClick={() => handleSortChange("created_at")}
        >
          Sort by Date{" "}
          {sortField === "created_at" &&
            (sortOrder === "asc" ? "\u2191" : "\u2193")}
        </button>
      </div>
      <div className='comment-list mt-6'>
        {comments && comments.length > 0 && renderCommentTree(comments)}
      </div>
      <div className='pagination-controls mt-4 flex justify-center items-center gap-4'>
        <button
          className='bg-gray-300 px-4 py-2 rounded'
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className='text-lg font-semibold'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className='bg-gray-300 px-4 py-2 rounded'
          onClick={handleNextPage}
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentList;
