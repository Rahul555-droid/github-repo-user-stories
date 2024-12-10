module.exports = {
  Repository: {
    async releases(repository, _, { models }) {
      return models.Release.findAll({
        where: { repositoryId: repository.id },
      });
    },
  },
  Release: {
    seen(release, _, { user, models }) {
      // Seen status is provided directly in the getReleases resolver
      return release.seen;
    },
  },
};
