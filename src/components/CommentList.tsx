import React, { useState } from "react";
import CommentItem from "./CommentItem";
import IComment from "../interfaces/IComment";
import { useSelector } from "react-redux";
import NewCommentsButton from "./NewCommentsButton";

const COMMENTS_PER_PAGE = 25;

const CommentList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const comments = useSelector(
    (state: { comments: { comments: IComment[] } }) => state.comments.comments
  );

  let rootComments = comments.filter((comment) => comment.parent_id === null);

  if (sortField) {
    rootComments = rootComments.sort((a, b) => {
      if (sortField === "created_at") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = (a as any)[sortField].toLowerCase();
        const valueB = (b as any)[sortField].toLowerCase();
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });
  }

  const totalPages = Math.ceil(rootComments.length / COMMENTS_PER_PAGE);

  const paginatedRootComments = rootComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  const buildCommentTree = (parentId: number | null) => {
    return comments
      .filter((comment) => comment.parent_id === parentId)
      .map((comment, index) => (
        <CommentItem
          key={index}
          comment={comment}
        >
          {buildCommentTree(comment.id)}
        </CommentItem>
      ));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

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
        {paginatedRootComments.map((comment) => (
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
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentList;
