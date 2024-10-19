import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { setComments } from "../store/comments.slice";
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
    if (data && data.rootComments) {
      const commentsWithReplies = data.rootComments.flatMap(
        (rootComment: IComment) => [rootComment, ...(rootComment.replies ?? [])]
      );
      dispatch(setComments([...newComments, ...commentsWithReplies]));
    }
  }, [data, dispatch, newComments]);

  const handleNextPage = () => {
    if (!loading) {
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

  const totalPages = Math.ceil(
    comments.filter((comment) => comment.parent_id === null).length /
      COMMENTS_PER_PAGE
  );

  return {
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
  };
};

export default useCommentsContainer;
