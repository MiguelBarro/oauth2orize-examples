'use strict';

const passport = require('passport');

module.exports.info = [
  passport.authenticate('bearer', { session: false, assignProperty: 'user_data' }),
  (request, response) => {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    response.json({ 
        userId: request.user_data.username }); // <- we are sending the user_id
  }
];
