const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const { sequelize, User } = require("./models");
const cors = require("cors");

require("dotenv").config();

const startServer = async () => {
  // Initialize Express
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3003", // Replace with your frontend URL
      credentials: true, // Allow cookies to be sent
    })
  );

  // Middleware
  app.use(cookieParser());

  // Sync Sequelize models
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

  // GitHub OAuth: Initiate Login
  app.get("/auth/github", (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize`;
    const queryParams = `?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user`;
    res.redirect(githubAuthUrl + queryParams);
  });

  // GitHub OAuth: Callback
  app.get("/auth/github/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Code not provided");
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        return res.status(400).send("Token not received");
      }

      // Fetch user info from GitHub
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const profile = userResponse.data;
      const [userInDb] = await User.findOrCreate({
        where: { githubId: String(profile.id) },
        defaults: {
          githubId: String(profile.id),
          username: profile.login, // user name
          email: profile.emails || null, //additional permission prolly required to get emails so ignore
          avatarUrl: profile.avatar_url || null,
          accessToken: access_token,
        },
      });
      const userCookieData = {
        id: userInDb.id, // The database ID of the user
        username: userInDb.username,
        avatar_url: userInDb.avatarUrl,
        login: userInDb.username,
      };
      // Store user info in cookies (for simplicity)
      res.cookie("github_token", access_token, { httpOnly: true });
      res.cookie("github_user", JSON.stringify(userCookieData), {
        httpOnly: true,
      });

      res.redirect("http://localhost:3003/"); // Redirect to the frontend
    } catch (error) {
      console.error("GitHub OAuth Error:", error);
      res.status(500).send("Error authenticating with GitHub");
    }
  });

  // GitHub OAuth: Get Authenticated User
  app.get("/auth/me", (req, res) => {
    console.log("🚀 auth me pe request hit");
    const token = req.cookies.github_token;
    const user = req.cookies.github_user
      ? JSON.parse(req.cookies.github_user)
      : null;
    if (!token || !user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({ user });
  });

  // GitHub OAuth: Logout
  app.get("/auth/logout", (req, res) => {
    // Clear the authentication cookies
    res.clearCookie("github_token", { httpOnly: true });
    res.clearCookie("github_user", { httpOnly: true });

    // Optionally redirect to the frontend or send a success response
    res.status(200).json({ message: "Logged out successfully" });
  });

  // Start Express server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(
      `GraphQL endpoint ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

startServer();
