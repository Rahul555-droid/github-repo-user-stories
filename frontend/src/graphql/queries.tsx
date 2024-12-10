import { gql } from '@apollo/client';

export const GET_USER_REPOSITORIES = gql`
  query GetUserRepositories {
    getUserRepositories {
      repository {
        id
        name
        url
        description
        releases {
          id
          version
          releaseDate
        }
      }
      seenReleases
    }
  }
`;


export const GET_RELEASES = gql`
  query GetReleases($repositoryId: ID!) {
    getReleases(repositoryId: $repositoryId) {
      id
      version
      releaseDate
      seen
    }
  }
`;
