import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import IComment from "../interfaces/IComment";
import CommentForm from "./CommentForm";
import { useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { addRepliesToComment } from "../store/comments.slice";
import { GET_REPLIES } from "../graphql/queries/getReplies";

interface CommentItemProps {
  comment: IComment;
  children?: React.ReactNode;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, children }) => {
  const [toggler, setToggler] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [hasReplies, setHasReplies] = useState(comment.hasReplies);

  const dispatch = useDispatch();

  const [getReplies, { loading }] = useLazyQuery(GET_REPLIES, {
    onCompleted: (data) => {
      if (data && data.getReplies) {
        const { comments: replies, hasMoreReplies } = data.getReplies;

        dispatch(
          addRepliesToComment({ parentId: comment.id, replies, hasMoreReplies })
        );

        setHasReplies(false);
      }
    },
  });

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const loadMoreReplies = () => {
    getReplies({
      variables: {
        parentId: comment.id,
        limit: 5,
        offset: comment.replies ? comment.replies.length : 0,
      },
    });
  };

  const handleReplySubmitSuccess = () => {
    setShowReplyForm(false);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
      <div className='comment-header mb-2'>
        <strong className='text-blue-600'>{comment.user_name}</strong>
        <small className='text-gray-500 ml-2'>{comment.created_at}</small>
      </div>
      <div
        className='comment-body text-gray-800'
        dangerouslySetInnerHTML={{ __html: comment.text }}
      ></div>

      {comment.image_url && (
        <>
          <img
            src={comment.image_url}
            alt='Comment Image'
            style={{ width: "150px", cursor: "pointer", marginTop: "10px" }}
            onClick={() => setToggler(!toggler)}
          />
          <FsLightbox
            toggler={toggler}
            sources={[comment.image_url]}
          />
        </>
      )}

      <div className='mt-2'>
        <button
          className='text-blue-500 hover:underline'
          onClick={toggleReplyForm}
        >
          Reply
        </button>
      </div>

      {showReplyForm && (
        <div className='mt-4 ml-4'>
          <CommentForm
            parentId={comment.id}
            onSubmitSuccess={handleReplySubmitSuccess}
          />
        </div>
      )}

      {children && <div className='replies mt-4 ml-6'>{children}</div>}

      {hasReplies && (
        <div className='mt-2'>
          <button
            className='text-blue-500 hover:underline'
            onClick={loadMoreReplies}
            disabled={loading}
          >
            {loading ? "Loading..." : "Expand Thread"}
          </button>
        </div>
      )}

      {comment.hasMoreReplies && (
        <div className='load-more-replies mt-2 ml-6'>
          <button
            className='text-blue-500 hover:underline'
            onClick={loadMoreReplies}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more replies"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
