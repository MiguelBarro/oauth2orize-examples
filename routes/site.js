'use strict';

const clients = require('../db');
const passport = require('passport');
const login = require('connect-ensure-login');
const fs = require('fs');
const path = require('path');

module.exports.index = (request, response) => {
    let msg = "";
    if (request.user == undefined )
    {
        msg = 'Nobody login yet';
    }
    else
    {
        msg = request.user.username + ' is logged';
    }
    response.render('home', {user_identity: msg});
};

module.exports.loginForm = (request, response) => response.render('login');

module.exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

module.exports.reset = (request, response) => {

    try
    {
        const state_dir = process.env.state || path.join(__dirname, "..", "state");
        fs.unlinkSync(path.join(state_dir, "access_tokens.json")); 
        fs.unlinkSync(path.join(state_dir, "authorization_codes.json")); 
        fs.unlinkSync(path.join(state_dir, "refresh_tokens.json")); 
    }
    catch(err) {}
    response.redirect('/');
};


module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};
