const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const { sequelize, User } = require("./models");
const cors = require("cors");
const authRoutes = require("./routes/auth");

// require("dotenv").config();

const startServer = async () => {
  // Initialize Express
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3003", 
      credentials: true, // Allow cookies to be sent
    })
  );

  app.use(cookieParser());

  await sequelize.sync();

  // Apollo Server setup
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    debug: true, // Enable debug mode
    context: ({ req }) => {
      return {
        models: require("./models"),
        user: req.cookies.github_user
          ? JSON.parse(req.cookies.github_user)
          : null, // Add user context
      };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false }); // I have already defined cors in express and this gives error on frontend
  //path: "/graphql" , also can add this.

  //routes 
  app.use("/auth", authRoutes);

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(
      `GraphQL endpoint ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

startServer();
