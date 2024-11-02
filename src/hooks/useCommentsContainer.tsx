import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import {
  setNewComments,
  setComments,
  setTotalComments,
} from "../store/comments.slice";
import IComment from "../interfaces/IComment";
import CommentItem from "../components/CommentItem";
import { GET_ROOT_COMMENTS } from "../graphql/queries/getRootComments";

const COMMENTS_PER_PAGE = 25;

const useCommentsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dispatch = useDispatch();
  const comments = useSelector(
    (state: { comments: { comments: IComment[] } }) => state.comments.comments
  );
  const newComments = useSelector(
    (state: { comments: { newComments: IComment[] } }) =>
      state.comments.newComments
  );
  const totalComments = useSelector(
    (state: { comments: { totalComments: number } }) =>
      state.comments.totalComments
  );

  const [getRootComments, { loading, error, data }] = useLazyQuery(
    GET_ROOT_COMMENTS,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    getRootComments({
      variables: {
        sortField,
        sortOrder,
        limit: COMMENTS_PER_PAGE,
        offset: (currentPage - 1) * COMMENTS_PER_PAGE,
      },
    });
  }, [sortField, sortOrder, currentPage, getRootComments]);

  useEffect(() => {
    if (data && data.getRootComments && data.getRootComments.comments) {
      const { comments: rootComments, totalComments } = data.getRootComments;

      dispatch(setComments([...rootComments]));
      dispatch(setNewComments([]));
      dispatch(setTotalComments(totalComments));

      console.log(rootComments);
    }
  }, [data, dispatch]);

  const handleNextPage = () => {
    if (!loading && currentPage * COMMENTS_PER_PAGE < totalComments) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (!loading && currentPage > 1) {
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

  const renderCommentTree = (comments: IComment[]): React.ReactNode => {
    if (!comments || comments.length === 0) {
      return null;
    }

    return comments.map((comment) => (
      <CommentItem
        key={comment.id}
        comment={comment}
      >
        {comment.replies && comment.replies.length > 0 && (
          <div className='ml-4'>{renderCommentTree(comment.replies)}</div>
        )}
      </CommentItem>
    ));
  };

  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

  return {
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
  };
};

export default useCommentsContainer;
