import gql from "graphql-tag";

export const devsTypeDefs = gql`
  type Dev {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type AuthPayload {
  token: String!
  dev: Dev!
  }

  type Query {
    devs: [Dev!]!
    dev(id: ID!): Dev
  }

  type Mutation {
    createDev(firstName: String!, lastName: String!, email: String!, password: String!): Dev!
    loginDev(email: String!, password: String!): AuthPayload!
    updateDev(id: ID!, firstName: String, email: String): Dev
    deleteDev(id: ID!): Boolean!
  }
`;