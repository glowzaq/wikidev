import { gql } from "@apollo/client";

export const GET_DEV_BOOKMARKS = gql`
  query GetDevBookmarks($id: ID!) {
    dev(id: $id) {
      id
      bookmarks {
        id
        title
        category
        content
        createdAt
        author
      }
    }
  }
`;

export const GET_DEV = gql`
  query GetDev($id: ID!) {
    dev(id: $id) {
      id
      firstName
      lastName
      email
      role
      bio
    }
  }
`;

export const GET_STATS = gql`
  query GetStats {
    articlesCount
    devsCount
  }
`;
