import { gql } from "@apollo/client";

export const GET_USER_ARTICLES = gql`
  query GetUserArticles($author: String!) {
    userArticles(author: $author) {
      id
      title
      content
      category
      author
      likes
      comments {
        id
        userId
        userName
        text
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;
