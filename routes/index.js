'use strict';

const site = require('./site');
const oauth2 = require('./oauth2');
const user = require('./user');
const client = require('./client');
const users = require('./users');
const clients = require('./clients');

module.exports = {
  site,
  oauth2,
  user,
  client,
  users,
  clients
};
