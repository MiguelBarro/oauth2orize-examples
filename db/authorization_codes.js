'use strict';

const path = require('path')
const fs = require('fs')

const users = require('./users');
const clients = require('./clients');

const state_dir = process.env.state || path.join(__dirname, "..", "state");
const JSONBackup = require('./json-backup');
let JB = new JSONBackup(path.join(state_dir, "authorization_codes.json"));

// const codes = [{
// code: '572b81ee-e560-4579-a0c4-761ce01c0723',
// clientId: 'eProsima-ros',
// redirectUri: 'www.client.eprosima.com',
// userId: 2,
// userName: Guybrush
// }];
// code is a key

module.exports.find = (key, done) => {

    let id = JB.find_element((x) => {
        return x.code == key;
    });

    if (id)
        return JB.get_element(id,done);

    return done(new Error('Code Not Found'));
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

module.exports.save = (code, clientId, redirectUri, userId, userName, done) => {

    // check is not registered yet
    if (JB.find_element((x) => { return x.code == code; }))
        throw new Error('Code already registered');

    // check that userId and clientId exists
    users.findById(userId,(err) => { if(err) throw err; });

    // add the new code entry
    JB.add_element({
        code: code,
        clientId: clientId,
        redirectUri: redirectUri,
        userId: userId,
        userName: userName
    });

    if (done)
        done();
};
