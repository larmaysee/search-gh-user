import { gql } from "@apollo/client";

export const ADD_ISSUE = gql`
  mutation AddIssue($repositoryId: ID!, $title: String!, $body: String) {
    createIssue(
      input: { repositoryId: $repositoryId, title: $title, body: $body }
    ) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`;
