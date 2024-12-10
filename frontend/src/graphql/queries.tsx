import { gql } from '@apollo/client';

// GraphQL Queries and Mutations
export const GET_REPOSITORIES = gql`
  query GetRepositories {
    getRepositories {
      id
      name
      url
      description
      releases {
        id
        version
        releaseDate
        seen
      }
    }
  }
`;

