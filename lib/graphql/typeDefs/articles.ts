import gql from "graphql-tag";

export const articlesTypeDefs = gql`
  type Comment {
    id: ID!
    userId: String!
    userName: String!
    text: String!
    createdAt: String!
  }

  type Article {
    id: ID!
    title: String!
    content: String!
    category: String!
    author: String!
    authorId: String
    likes: [String!]
    comments: [Comment!]
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    articles: [Article!]!
    article(id: ID!): Article
    userArticles(author: String!): [Article!]!
    userArticlesById(authorId: ID!): [Article!]!
    articlesCount: Int!
  }

  extend type Mutation {
  createArticle(
    title: String!
    content: String!
    category: String!
    author: String!
    authorId: String!
  ): Article!
  updateArticle(
    id: ID!
    title: String
    content: String
    category: String
  ): Article!
  deleteArticle(
    id: ID!
  ): Article
  likeArticle(articleId: ID!, userId: ID!): Article!
  unlikeArticle(articleId: ID!, userId: ID!): Article!
  commentArticle(articleId: ID!, userId: ID!, userName: String!, text: String!): Article!
}
`;