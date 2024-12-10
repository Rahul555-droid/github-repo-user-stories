import { gql } from '@apollo/client';

export const ADD_REPOSITORY = gql`
  mutation AddRepository( $url: String!) {
    addRepository(url: $url) {
      id
      name
      url
      description
    }
  }
`;


export const FETCH_LATEST_RELEASE = gql`
  mutation FetchLatestRelease($repositoryId: ID!) {
    fetchLatestRelease(repositoryId: $repositoryId) {
      id
      version
      releaseDate
      seen
    }
  }
`;

export const MARK_RELEASE_AS_SEEN = gql`
  mutation MarkReleaseAsSeen($releaseId: ID!) {
    markReleaseAsSeen(releaseId: $releaseId) {
      id
      version
      seen
    }
  }
`;