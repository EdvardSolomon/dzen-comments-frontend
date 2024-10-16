import React from "react";
import CommentItem from "./CommentItem";
import IComment from "../interfaces/IComment";
import { useSelector } from "react-redux";

const CommentList: React.FC = () => {
  const comments = useSelector(
    (state: { comments: IComment[] }) => state.comments
  );

  const buildCommentTree = (parentId: number | null) => {
    return comments
      .filter((comment) => comment.parent_id === parentId)
      .map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        >
          {buildCommentTree(comment.id)}
        </CommentItem>
      ));
  };

  return <div className='comment-list mt-6'>{buildCommentTree(null)}</div>;
};

export default CommentList;
