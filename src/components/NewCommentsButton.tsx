import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { mergeNewComments } from "../store/comments.slice";
import IComment from "../interfaces/IComment";

const NewCommentsButton: React.FC = () => {
  const dispatch = useDispatch();
  const newComments = useSelector(
    (state: { comments: { newComments: IComment[] } }) =>
      state.comments.newComments
  );

  if (newComments.length === 0) {
    return null;
  }

  const handleAddNewComments = () => {
    dispatch(mergeNewComments());
  };

  return (
    <div className='new-comments-button text-center my-4'>
      <button
        className='bg-red-500 text-white px-4 py-2 rounded-lg w-1/2'
        onClick={handleAddNewComments}
      >
        +{newComments.length} new comment{newComments.length > 1 ? "s" : ""}
      </button>
    </div>
  );
};

export default NewCommentsButton;
