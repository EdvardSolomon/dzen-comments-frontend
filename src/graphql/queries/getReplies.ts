import { gql } from "@apollo/client";

export const GET_REPLIES = gql`
  query GetReplies($parentId: String!, $limit: Int!, $offset: Int!) {
    getReplies(parentId: $parentId, limit: $limit, offset: $offset) {
      hasMoreReplies
      comments {
        created_at
        email
        hasReplies
        id
        image_url
        parent_id
        text
        user_name
      }
    }
  }
`;
