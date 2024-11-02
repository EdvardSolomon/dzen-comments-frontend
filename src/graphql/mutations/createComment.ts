import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      user_name
      email
      created_at
      text
      parent_id
      image_url
    }
  }
`;
