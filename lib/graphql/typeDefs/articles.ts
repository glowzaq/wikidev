import gql from "graphql-tag";

export const articlesTypeDefs = gql`
  type Article {
    id: ID!
    title: String!
    content: String!
    category: String!
    author: String!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    articles: [Article!]!
    article(id: ID!): Article
  }
`;