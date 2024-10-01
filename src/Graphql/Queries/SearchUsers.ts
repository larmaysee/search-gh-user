import { gql } from "@apollo/client";

export const SEARCH_USERS = gql`
  query GetUsers($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: USER, first: $first, after: $after) {
      userCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ... on User {
          id
          login
          name
          avatarUrl
        }
      }
    }
  }
`;
