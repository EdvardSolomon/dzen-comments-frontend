import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IComment from "../interfaces/IComment";

interface CommentsState {
  comments: IComment[];
  newComments: IComment[];
}

const initialState: CommentsState = {
  comments: [
    {
      id: 1,
      user_name: "John Doe",
      created_at: "2024-10-01 12:00",
      text: "Это тестовый комментарий.",
      email: "email.com",
      parent_id: null,
    },
    {
      id: 2,
      user_name: "Jane Smith",
      created_at: "2024-10-01 12:30",
      text: `<strong>Это ответ на первый комментарий.</strong> <script> console.log("Hello"); </script>`,
      email: "email.com",
      parent_id: 1,
    },
    {
      id: 3,
      user_name: "Alice Johnson",
      created_at: "2024-10-01 13:00",
      text: "Это ответ на ответ.",
      email: "email.com",
      parent_id: 2,
    },
    {
      id: 4,
      user_name: "Jane Smith",
      created_at: "2024-10-02 14:30",
      text: "Еще один комментарий без ответов.",
      email: "email.com",
      parent_id: null,
    },
    {
      id: 5,
      user_name: "John Doe",
      created_at: "2024-10-03 09:15",
      text: "Комментарий от John без ответов.",
      email: "email.com",
      parent_id: null,
    },
    {
      id: 6,
      user_name: "Alice Johnson",
      created_at: "2024-10-03 10:00",
      text: "Ответ на комментарий John.",
      email: "email.com",
      parent_id: 5,
      image_url:
        "https://cdn.factorio.com/assets/blog-sync/fff-431-stromatolites.png",
    },
  ],
  newComments: [],
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<IComment>) => {
      const newComment = action.payload;
      if (newComment.parent_id === null) {
        state.comments.unshift(newComment);
      } else {
        const parentComment = state.comments.find(
          (comment) => comment.id === newComment.parent_id
        );

        if (parentComment) {
          if (parentComment.replies) {
            parentComment.replies.push(newComment);
          } else {
            parentComment.replies = [newComment];
          }
        }
      }
    },
    addNewComment: (state, action: PayloadAction<IComment>) => {
      const newComment = action.payload;
      if (newComment.parent_id === null) {
        state.newComments.unshift(newComment);
      } else {
        const parentComment = state.comments.find(
          (comment) => comment.id === newComment.parent_id
        );
        if (parentComment) {
          if (parentComment.replies) {
            parentComment.replies.push(newComment);
          } else {
            parentComment.replies = [newComment];
          }
        }
      }
    },
    mergeNewComments: (state) => {
      state.comments = [...state.newComments, ...state.comments];
      state.newComments = [];
    },
    setComments: (state, action: PayloadAction<IComment[]>) => {
      state.comments = action.payload;
    },
  },
});

export const { addComment, addNewComment, mergeNewComments, setComments } =
  commentsSlice.actions;

export default commentsSlice.reducer;
