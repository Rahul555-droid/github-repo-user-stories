const { gql } = require('apollo-server');

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
    seen: Boolean!
    repository: Repository!
  }

  type Query {
    getRepositories: [Repository!]!
    getRepository(id: ID!): Repository
    getReleases(repositoryId: ID!): [Release!]!
  }

  type Mutation {
    addRepository(url: String!): Repository!
    addRelease(repositoryId: ID!, version: String!, releaseDate: String!): Release!
    markReleaseAsSeen(releaseId: ID!): Release!
    fetchLatestRelease(repositoryId: ID!): Release!
  }
`;

module.exports = typeDefs;
