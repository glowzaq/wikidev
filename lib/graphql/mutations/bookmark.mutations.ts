import { gql } from "@apollo/client";

export const BOOKMARK_ARTICLE = gql`
  mutation BookmarkArticle($devId: ID!, $articleId: ID!) {
    bookmarkArticle(devId: $devId, articleId: $articleId) {
      id
      bookmarks {
        id
      }
    }
  }
`;

export const UNBOOKMARK_ARTICLE = gql`
  mutation UnbookmarkArticle($devId: ID!, $articleId: ID!) {
    unbookmarkArticle(devId: $devId, articleId: $articleId) {
      id
      bookmarks {
        id
      }
    }
  }
`;
