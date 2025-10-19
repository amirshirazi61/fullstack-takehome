import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($filters: UserFilters!) {
    users(filters: $filters) {
      id
      name
      age
      email
      phone
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($filters: PostFilters!) {
    posts(filters: $filters) {
      id
      userId
      title
      content
      createdAt
      updatedAt
    }
  }
`;
