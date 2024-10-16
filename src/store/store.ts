import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "./comments.slice";

export default configureStore({
  reducer: {
    comments: commentsReducer,
  },
});
