import { gql } from "@apollo/client";

export const LIKE_ARTICLE = gql`
  mutation LikeArticle($articleId: ID!, $userId: ID!) {
    likeArticle(articleId: $articleId, userId: $userId) {
      id
      likes
    }
  }
`;

export const UNLIKE_ARTICLE = gql`
  mutation UnlikeArticle($articleId: ID!, $userId: ID!) {
    unlikeArticle(articleId: $articleId, userId: $userId) {
      id
      likes
    }
  }
`;

export const COMMENT_ARTICLE = gql`
  mutation CommentArticle($articleId: ID!, $userId: ID!, $userName: String!, $text: String!) {
    commentArticle(articleId: $articleId, userId: $userId, userName: $userName, text: $text) {
      id
      comments {
        id
        userId
        userName
        text
        createdAt
      }
    }
  }
`;
