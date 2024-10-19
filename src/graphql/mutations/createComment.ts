import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $userName: String!
    $email: String!
    $text: String!
    $createdAt: String!
    $parentId: Int
    $imageUrl: String
  ) {
    createComment(
      user_name: $userName
      email: $email
      text: $text
      created_at: $createdAt
      parent_id: $parentId
      image_url: $imageUrl
    ) {
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
