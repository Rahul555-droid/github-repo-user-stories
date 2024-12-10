import { gql } from '@apollo/client'

export const ADD_REPOSITORY = gql`
  mutation AddRepository($url: String!) {
    addRepository(url: $url) {
      repository {
        id
        name
        url
        description
      }
      seenReleases
    }
  }
`

export const MARK_RELEASE_AS_SEEN = gql`
  mutation MarkReleaseAsSeen($repositoryId: ID!, $releaseId: ID!) {
    markReleaseAsSeen(repositoryId: $repositoryId, releaseId: $releaseId)
  }
`

export const REFRESH_REPOSITORIES = gql`
  mutation RefreshReleases {
    refreshReleases
  }
`
