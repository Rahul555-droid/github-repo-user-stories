const express = require("express");
const axios = require("axios");
const { User } = require("../models");

const router = express.Router();

  // GitHub OAuth: Initiate Login
  router.get("/github", (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize`;
    const queryParams = `?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user`;
    res.redirect(githubAuthUrl + queryParams);
  });

  // GitHub OAuth: Callback
  router.get("/github/callback", async (req, res) => {
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
  router.get("/me", (req, res) => {
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
  router.get("/logout", (req, res) => {
    // Clear the authentication cookies
    res.clearCookie("github_token", { httpOnly: true });
    res.clearCookie("github_user", { httpOnly: true });

    // Optionally redirect to the frontend or send a success response
    res.status(200).json({ message: "Logged out successfully" });
  });

  module.exports = router;
