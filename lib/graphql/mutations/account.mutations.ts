import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateDev($id: ID!, $firstName: String, $lastName: String, $email: String, $bio: String) {
    updateDev(id: $id, firstName: $firstName, lastName: $lastName, email: $email, bio: $bio) {
      id
      firstName
      lastName
      email
      bio
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($id: ID!, $currentPassword: String!, $newPassword: String!) {
    updatePassword(id: $id, currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;
