'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');

// Express configuration
const app = express();
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler());
app.use(session({ secret: 'session_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// listening port settable from the environment
let port = process.env.PORT || 3000;

// Passport configuration
require('./auth');

// routing
const routes = require('./routes');
app.use(express.static('assets'));
app.get('/', routes.site.index);
app.get('/clients', routes.clients);
app.get('/users', routes.users);

app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/reset', routes.site.reset);

app.get('/dialog/authorize', routes.oauth2.authorization);
app.post('/dialog/authorize/decision', routes.oauth2.decision);
app.post('/oauth/token', routes.oauth2.token);

app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);

// Set up SSL
if (process.env.SSL_SERVER)
{
    const https = require('https');
    const fs = require('fs');

    let options = {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'NodeRED_privkey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'NodeRED_chain.pem'))
    };

    https.createServer(options, app).listen(port);
}
else
{
    app.listen(port);
}
