import { gql } from "@apollo/client";

export const GET_ISSUES = gql`
  query GetIssues(
    $owner: String!
    $name: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $state: [IssueState!]
  ) {
    repository(owner: $owner, name: $name) {
      issues(
        states: $state
        first: $first
        last: $last
        after: $after
        before: $before
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          id
          title
          body
          state
          createdAt
          updatedAt
          author {
            login
          }
        }
      }
    }
  }
`;
