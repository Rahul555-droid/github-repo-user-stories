const queries = require("./queries");
const mutations = require("./mutations");
const types = require("./types");

module.exports = {
  ...queries,
  ...mutations,
  ...types,
};
