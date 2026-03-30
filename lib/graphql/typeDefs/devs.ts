import gql from "graphql-tag";

export const devsTypeDefs = gql`
  type Dev {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Query {
    devs: [Dev!]!
    dev(id: ID!): Dev
  }

  type Mutation {
    createDev(firstName: String!, lastName: String!, email: String!, password: String!): Dev!
    updateDev(id: ID!, firstName: String, email: String): Dev
    deleteDev(id: ID!): Boolean!
  }
`;