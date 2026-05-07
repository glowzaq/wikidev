import { gql } from "@apollo/client";

export const CREATE_ARTICLE = gql`
  mutation CreateArticle(
    $title: String!
    $content: String!
    $category: String!
    $author: String!
    $authorId: String!
  ) {
    createArticle(
      title: $title
      content: $content
      category: $category
      author: $author
      authorId: $authorId
    ) {
      id
      title
      content
      category
      author
      authorId
      createdAt
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle(
    $id: ID!
    $title: String
    $content: String
    $category: String
  ) {
    updateArticle(
      id: $id
      title: $title
      content: $content
      category: $category
    ) {
      id
      title
      content
      category
      updatedAt
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id) {
      id
    }
  }
`;

