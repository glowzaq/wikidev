import { gql } from "@apollo/client";

export const CREATE_DEV = gql`
  mutation CreateDev(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createDev(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;