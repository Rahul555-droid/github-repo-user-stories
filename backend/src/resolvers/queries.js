

module.exports = {
    Query: {
        async getUserRepositories(_, __, { user, models }) {
          if (!user) throw new Error("Not authenticated");
    
          const userRepositories = await models.UserRepository.findAll({
            where: { userId: user.id },
            include: models.Repository,
          });
    
          return userRepositories.map((userRepo) => ({
            repository: userRepo.Repository,
            seenReleases: userRepo.seenReleases || [],
          }));
        },
        async getRepository(_, { id }, { models }) {
          return models.Repository.findByPk(id, {
            include: models.Release,
          });
        },
        async getReleases(_, { repositoryId }, { user, models }) {
          if (!user) throw new Error("Not authenticated");
    
          const userRepository = await models.UserRepository.findOne({
            where: { userId: user.id, repositoryId },
          });
    
          if (!userRepository) {
            throw new Error("Repository not tracked by user");
          }
    
          const releases = await models.Release.findAll({
            where: { repositoryId },
          });
    
          const seenReleases = userRepository.seenReleases || [];
    
          return releases.map((release) => ({
            ...release.toJSON(),
            seen: seenReleases.includes(release.id),
          }));
        },
      },
}