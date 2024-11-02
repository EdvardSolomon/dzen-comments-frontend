import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IComment from "../interfaces/IComment";

interface CommentsState {
  comments: IComment[];
  newComments: IComment[];
  totalComments: number;
}

const initialState: CommentsState = {
  comments: [],
  newComments: [],
  totalComments: 0,
};

const findAndAddReply = (
  comments: IComment[],
  newComment: IComment
): boolean => {
  for (const comment of comments) {
    if (comment.id === newComment.parent_id) {
      if (comment.replies) {
        comment.replies.push(newComment);
      } else {
        comment.replies = [newComment];
      }
      return true;
    } else if (comment.replies && comment.replies.length > 0) {
      const found = findAndAddReply(comment.replies, newComment);
      if (found) return true;
    }
  }
  return false;
};

const findAndUpdateReplies = (
  comments: IComment[],
  parentId: number,
  newReplies: IComment[],
  hasMoreReplies: boolean
): boolean => {
  for (const comment of comments) {
    if (comment.id === parentId) {
      if (comment.replies) {
        comment.replies = [...comment.replies, ...newReplies];
      } else {
        comment.replies = newReplies;
      }
      comment.hasMoreReplies = hasMoreReplies;
      return true;
    } else if (comment.replies && comment.replies.length > 0) {
      const found = findAndUpdateReplies(
        comment.replies,
        parentId,
        newReplies,
        hasMoreReplies
      );
      if (found) return true;
    }
  }
  return false;
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setRootComments: (
      state,
      action: PayloadAction<{ comments: IComment[]; totalComments: number }>
    ) => {
      state.comments = action.payload.comments;
      state.totalComments = action.payload.totalComments;
    },
    addComment: (state, action: PayloadAction<IComment>) => {
      const newComment = action.payload;
      if (newComment.parent_id === null) {
        state.comments.unshift(newComment);
      } else {
        findAndAddReply(state.comments, newComment);
      }
    },
    addNewComment: (state, action: PayloadAction<IComment>) => {
      const newComment = action.payload;
      if (newComment.parent_id === null) {
        state.newComments.unshift(newComment);
      } else {
        findAndAddReply(state.newComments, newComment);
      }
    },
    mergeNewComments: (state) => {
      state.comments = [...state.newComments, ...state.comments];
      state.newComments = [];
    },
    setComments: (state, action: PayloadAction<IComment[]>) => {
      state.comments = action.payload;
    },
    setNewComments: (state, action: PayloadAction<IComment[]>) => {
      state.newComments = action.payload;
    },
    setTotalComments: (state, action: PayloadAction<number>) => {
      state.totalComments = action.payload;
    },
    addRepliesToComment: (
      state,
      action: PayloadAction<{
        parentId: number;
        replies: IComment[];
        hasMoreReplies: boolean;
      }>
    ) => {
      const { parentId, replies, hasMoreReplies } = action.payload;
      findAndUpdateReplies(state.comments, parentId, replies, hasMoreReplies);
    },
  },
});
export const {
  setRootComments,
  addComment,
  addNewComment,
  mergeNewComments,
  setComments,
  setNewComments,
  setTotalComments,
  addRepliesToComment,
} = commentsSlice.actions;

export default commentsSlice.reducer;
