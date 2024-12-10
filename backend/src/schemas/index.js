const { gql } = require("apollo-server");

const typeDefs = gql`
  type Repository {
    id: ID!
    name: String!
    url: String!
    description: String
    releases: [Release!]!
  }

  type Release {
    id: ID!
    version: String!
    releaseDate: String!
    repository: Repository!
    seen: Boolean! # Add the 'seen' field
  }

  type UserRepository {
    repository: Repository!
    seenReleases: [ID!]! # Array of seen release IDs for the user
  }

  type Query {
    getUserRepositories: [UserRepository!]!
    getRepository(id: ID!): Repository
    getReleases(repositoryId: ID!): [Release!]!
  }

  type Mutation {
    addRepository(url: String!): UserRepository!
    markReleaseAsSeen(repositoryId: ID!, releaseId: ID!): Boolean!
    refreshReleases: Boolean!
  }
`;

module.exports = typeDefs;
