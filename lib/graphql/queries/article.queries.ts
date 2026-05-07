import { gql } from "@apollo/client";

export const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      category
      author
      authorId
      likes
      comments {
        id
        userId
        userName
        text
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      category
      author
      authorId
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

export const GET_USER_ARTICLES_BY_ID = gql`
  query GetUserArticlesById($authorId: ID!) {
    userArticlesById(authorId: $authorId) {
      id
      title
      content
      category
      author
      authorId
      likes
      createdAt
    }
  }
`;
