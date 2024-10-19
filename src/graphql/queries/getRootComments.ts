import { gql } from "@apollo/client";

export const GET_ROOT_COMMENTS = gql`
  query GetRootComments(
    $sortField: String!
    $sortOrder: String!
    $limit: Int!
    $offset: Int!
  ) {
    rootComments(
      sortField: $sortField
      sortOrder: $sortOrder
      limit: $limit
      offset: $offset
    ) {
      id
      user_name
      email
      created_at
      text
      parent_id
      replies {
        id
        user_name
        email
        created_at
        text
        parent_id
      }
    }
  }
`;
