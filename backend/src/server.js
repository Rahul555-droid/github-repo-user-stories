const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { sequelize } = require('./models');

const startServer = async () => {
  // Sync Sequelize models with the database
  await sequelize.sync();

  // Create the Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      models: require('./models'), // Pass Sequelize models to resolvers
    }),
  });

  // Start the server
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

startServer();
