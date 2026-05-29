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

export const LOGIN_DEV = gql`
  mutation LoginDev(
  $email: String!
  $password: String!
  ) {
    loginDev(email: $email
    password: $password
    ) {
      token
      dev {
        id
        firstName
        lastName
        email
      }
    }
  }
`; 

export const GOOGLE_CALLBACK = gql`
  mutation GoogleCallback($code: String!) {
    googleCallback(code: $code) {
      token
      dev {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
