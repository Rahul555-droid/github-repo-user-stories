const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { sequelize } = require('./models');
const cors = require('cors')

require('dotenv').config();

const startServer = async () => {
  // Initialize Express
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3003', // Replace with your frontend URL
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
    context: ({ req }) => ({
      models: require('./models'),
      user: req.cookies.github_user ? JSON.parse(req.cookies.github_user) : null, // Add user context
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // GitHub OAuth: Initiate Login
  app.get('/auth/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize`;
    const queryParams = `?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user`;
    res.redirect(githubAuthUrl + queryParams);
  });

  // GitHub OAuth: Callback
  app.get('/auth/github/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Code not provided');
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        return res.status(400).send('Token not received');
      }

      // Fetch user info from GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const user = userResponse.data;

      // Store user info in cookies (for simplicity)
      res.cookie('github_token', access_token, { httpOnly: true });
      res.cookie('github_user', JSON.stringify(user), { httpOnly: true });

      res.redirect('http://localhost:3003/'); // Redirect to the frontend
    } catch (error) {
      console.error('GitHub OAuth Error:', error);
      res.status(500).send('Error authenticating with GitHub');
    }
  });

  // GitHub OAuth: Get Authenticated User
  app.get('/auth/me', (req, res) => {
    console.log('🚀 auth me pe request hit')
    const token = req.cookies.github_token;
    const user = req.cookies.github_user ? JSON.parse(req.cookies.github_user) : null;
    console.log({token, user});
    if (!token || !user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({ user });
  });

  // Start Express server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

startServer();
