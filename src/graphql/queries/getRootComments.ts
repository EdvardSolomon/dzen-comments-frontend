import { gql } from "@apollo/client";

export const GET_ROOT_COMMENTS = gql`
  query Comments(
    $sortField: String!
    $sortOrder: String!
    $limit: Int!
    $offset: Int!
  ) {
    getRootComments(
      sortField: $sortField
      sortOrder: $sortOrder
      limit: $limit
      offset: $offset
    ) {
      comments {
        id
        created_at
        email
        image_url
        parent_id
        text
        user_name
        replies {
          created_at
          email
          hasReplies
          id
          image_url
          parent_id
          text
          user_name
        }
        hasMoreReplies
      }
      totalComments
    }
  }
`;
