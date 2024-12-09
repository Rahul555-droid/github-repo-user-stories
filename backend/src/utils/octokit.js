// const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const octokitImport = async () => {
  const { Octokit } = await import('@octokit/rest');
  return new Octokit({
    auth: process.env.GITHUB_TOKEN, // Add your personal GitHub token in the .env file
  });
};

// let octokitExp = null;

// octokitImport().then((octokit) => {
//   // Use `octokit` here
//   octokitExp = octokit
//  });


// // const octokit = new Octokit({
// //   auth: process.env.GITHUB_TOKEN, // Add your personal GitHub token in the .env file
// // });

module.exports = octokitImport;
