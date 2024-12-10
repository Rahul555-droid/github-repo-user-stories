const octokitImport = require("../utils/octokit.js");

module.exports = {
  Mutation: {
    async addRepository(_, { url }, { user, models }) {
      // Extract owner and repo from the GitHub URL
      if (!user) throw new Error("Not authenticated");

      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error("Invalid GitHub URL");
      }
      const [temp, owner, repo] = match;
      const octokit = await octokitImport();

      const { data: repoData } = await octokit.repos.get({
        owner,
        repo,
      });

      let repository = await models.Repository.findOne({
        where: { url: repoData.html_url },
      });
      if (!repository) {
        repository = await models.Repository.create({
          name: repoData.full_name,
          url: repoData.html_url,
          description: repoData.description,
        });
      }

      //we could get all releases for this repo! but I think it is not the requirement and github won't allow those kind of calls
      const { data: latestReleaseData } = await octokit.repos.getLatestRelease({
        owner,
        repo,
      });

      const existingRelease = await models.Release.findOne({
        where: {
          repositoryId: repository.id,
          githubReleaseId: String(latestReleaseData.id), // Using GitHub-specific release ID for uniqueness
        },
      });

      // If the release does not exist, insert it into the Releases table
      if (!existingRelease) {
        await models.Release.create({
          repositoryId: repository.id,
          githubReleaseId: String(latestReleaseData.id),
          version: latestReleaseData.tag_name,
          releaseDate: latestReleaseData.published_at,
        });
      }

      // Add repository to UserRepositories
      const [userRepo] = await models.UserRepository.findOrCreate({
        where: { userId: user.id, repositoryId: repository.id },
      });

      return {
        repository,
        seenReleases: userRepo.seenReleases || [],
      };
      // Fetch repository details from GitHub
      // try{

      // }catch(error){
      //   console.error("Error adding repository and latest release:", error);
      // }
    },

    async markReleaseAsSeen(_, { repositoryId, releaseId }, { user, models }) {
      if (!user) throw new Error("Not authenticated");

      const userRepository = await models.UserRepository.findOne({
        where: { userId: user.id, repositoryId },
      });

      if (!userRepository) {
        throw new Error("Repository not tracked by user");
      }

      const seenReleases = userRepository.seenReleases || [];
      if (!seenReleases.includes(releaseId)) {
        seenReleases.push(releaseId);
        userRepository.seenReleases = seenReleases;
        await userRepository.save();
      }

      return true;
    },

    async refreshReleases(_, __, { user, models }) {
      if (!user) throw new Error("Not authenticated");

      // Fetch all repositories the user is tracking
      const userRepositories = await models.UserRepository.findAll({
        where: { userId: user.id },
        include: models.Repository,
      });

      let success = true;

      // Iterate over each repository to refresh release data
      for (const userRepo of userRepositories) {
        const repository = userRepo.Repository;
        const octokit = await octokitImport();

        try {
          // Fetch the latest release for the repository
          const { data: latestReleaseData } =
            await octokit.repos.getLatestRelease({
              owner: repository.url.split("/")[3], // Extract owner from URL
              repo: repository.url.split("/")[4], // Extract repo from URL
            });

          // Check if the release already exists in the database
          const existingRelease = await models.Release.findOne({
            where: {
              repositoryId: repository.id,
              githubReleaseId: String(latestReleaseData.id), // Unique GitHub release ID
            },
          });

          // If the release does not exist, insert it into the Releases table
          if (!existingRelease) {
            await models.Release.create({
              repositoryId: repository.id,
              githubReleaseId: String(latestReleaseData.id),
              version: latestReleaseData.tag_name,
              releaseDate: latestReleaseData.published_at,
              seen: false, // Default value for "seen" status
            });
          }
        } catch (error) {
          console.error(
            `Error refreshing releases for ${repository.name}:`,
            error
          );

          success = false; // Set success to false if any error occurs
        }
      }

      // Return success status (true if all went well, false if any error occurred)
      return success;
    },
  },
};
