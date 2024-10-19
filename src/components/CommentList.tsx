import React from "react";
import CommentItem from "./CommentItem";
import NewCommentsButton from "./NewCommentsButton";
import useCommentsContainer from "../hooks/useCommentsContainer";

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
    buildCommentTree,
    sortField,
    sortOrder,
  } = useCommentsContainer();

  if (loading) return <p>Loading comments...</p>;
  //if (error) return <p>Error loading comments: {error.message}</p>;

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
        {comments
          .filter((comment) => comment.parent_id === null)
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
            >
              {buildCommentTree(comment.id)}
            </CommentItem>
          ))}
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
