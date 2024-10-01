import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query (
    $login: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    user(login: $login) {
      repositories(
        first: $first
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $after
        last: $last
        before: $before
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            name
            description
            stargazerCount
            watchers {
              totalCount
            }
            primaryLanguage {
              name
            }
            updatedAt
            url
          }
        }
      }
    }
  }
`;
