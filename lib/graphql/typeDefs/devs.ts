import gql from "graphql-tag";

export const devsTypeDefs = gql`
  type Dev {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String!
    bio: String
    bookmarks: [Article]
  }

  type AuthPayload {
    token: String!
    dev: Dev!
  }

  type Query {
    devs: [Dev!]!
    dev(id: ID!): Dev
    devsCount: Int!
    googleAuthUrl: String!
  }

  type Mutation {
    createDev(firstName: String!, lastName: String!, email: String!, password: String!): Dev!
    loginDev(email: String!, password: String!): AuthPayload!
    googleCallback(code: String!): AuthPayload!
    updateDev(id: ID!, firstName: String, lastName: String, email: String, bio: String): Dev!
    updatePassword(id: ID!, currentPassword: String!, newPassword: String!): Boolean!
    deleteDev(id: ID!): Boolean!
    bookmarkArticle(devId: ID!, articleId: ID!): Dev!
    unbookmarkArticle(devId: ID!, articleId: ID!): Dev!
  }
`;