'use strict';

const path = require('path')
const fs = require('fs')

const users = require('./users');
const clients = require('./clients');

const state_dir = process.env.state || path.join(__dirname, "..", "state");
const JSONBackup = require('./json-backup');
let JB = new JSONBackup(path.join(state_dir, "refresh_tokens.json"));

// const tokens = [
// { token: '572b81ee-e560-4579-a0c4-761ce01c0723', userId: 4, clientId: 'eProsima'
// }];
// token is a key

module.exports.find = (key, done) => {

    let id = JB.find_element((x) => {
        return x.token == key;
    });

    if (id)
        return JB.get_element(id,done);

    return done(new Error('Token Not Found'));
};

module.exports.findByUserIdAndClientId = (userId, clientId, done) => {

    let id = JB.find_element((x) => {
        return x.userId == userId && x.clientId == clientId;
    });

    if (id)
        return JB.get_element(id,done);

    return done(new Error('Token Not Found'));
};

module.exports.save = (token, userId, clientId, done) => {

    // check is not registered yet
    if (JB.find_element((x) => { return x.token == token; }))
        throw new Error('Token already registered');

    // check that userId and clientId exists
    users.findById(userId,(err) => { if(err) throw err; });
    clients.findByClientId(clientId,(err) => { if(err) throw err; });

    // add the new token entry
    JB.add_element({
        token: token,
        userId: userId,
        clientId: clientId
    });

    if (done)
        done();
};

module.exports.removeByUserId = (userId) => {

    let id = JB.find_element((x) => {
        return x.userId == userId;
    });

    if(id)
    {
        JB.remove_element(id);
        return true;
    }

    return false;
};

module.exports.removeByClientId = (clientId) => {

    let id = JB.find_element((x) => {
        return x.clientId == clientId;
    });

    if(id)
    {
        JB.remove_element(id);
        return true;
    }

    return false;
};

module.exports.removeByUserIdAndClientId = (userId, clientId, done) => {

    let id = JB.find_element((x) => {
        return x.userId == userId && x.clientId == clientId;
    });

    if(id)
    {
        JB.remove_element(id);
        return done(null);
    }
    else
    {
        return done(new Error('Token Not Found'));
    }
};

module.exports.get_id = (token) => {
    return JB.find_element((x) => { return x.token == token; });
};
