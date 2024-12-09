const octokitImport = require("../utils/octokit.js");


module.exports = {
  Query: {
    async getRepositories(_, __, { models }) {
      return models.Repository.findAll();
    },
    async getRepository(_, { id }, { models }) {
      return models.Repository.findByPk(id, {
        include: models.Release,
      });
    },
    async getReleases(_, { repositoryId }, { models }) {
      return models.Release.findAll({
        where: { repositoryId },
      });
    },
  },
  Mutation: {
    async addRepository(_, {  url }, { models }) {
      // Extract owner and repo from the GitHub URL
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error("Invalid GitHub URL");
      }
      const [temp, owner, repo] = match;
      const octokit = await octokitImport();
      // Fetch repository details from GitHub
      const { data } = await octokit.repos.get({
        owner,
        repo,
      });
      console.log({data})

      // Save repository details to the database
      return models.Repository.create({
        name: data.full_name,
        url: data.html_url,
        description: data.description,
      });
    },
    async addRelease(_, { repositoryId, version, releaseDate }, { models }) {
      return models.Release.create({
        repositoryId,
        version,
        releaseDate: new Date(releaseDate),
      });
    },
    async markReleaseAsSeen(_, { releaseId }, { models }) {
      const release = await models.Release.findByPk(releaseId);
      if (!release) throw new Error("Release not found");
      release.seen = true;
      await release.save();
      return release;
    },
    async fetchLatestRelease(_, { repositoryId }, { models }) {
      // Find the repository in the database
      const repository = await models.Repository.findByPk(repositoryId);
      if (!repository) {
        throw new Error("Repository not found");
      }

      // Extract owner and repo from the URL
      const match = repository.url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error("Invalid GitHub URL in database");
      }
      const [temp, owner, repo] = match;
      const octokit = await octokitImport();
      // Fetch the latest release from GitHub
      const { data } = await octokit.repos.getLatestRelease({
        owner,
        repo,
      });

      // Save the release details to the database
      return models.Release.create({
        repositoryId: repository.id,
        version: data.tag_name,
        releaseDate: data.published_at,
        seen: false,
      });
    },
  },
  Repository: {
    async releases(repository, _, { models }) {
      return models.Release.findAll({
        where: { repositoryId: repository.id },
      });
    },
  },
  Release: {
    async repository(release, _, { models }) {
      return models.Repository.findByPk(release.repositoryId);
    },
  },
};
