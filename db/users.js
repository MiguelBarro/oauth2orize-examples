'use strict';

const path = require('path')
const fs = require('fs')

const at = require('./access_tokens');
const rt = require('./refresh_tokens');
const ac = require('./authorization_codes');

const state_dir = process.env.state || path.join(__dirname, "..", "state");
const JSONBackup = require('./json-backup');
let JB = new JSONBackup(path.join(state_dir, "users.json"));

// Assure the directory exists
fs.mkdirSync(state_dir, { recursive: true});

/*
 * User format:
const users = [
  { username: 'Miguel', password: 'eProsima'},
];
username is a key
*/

module.exports.addUser = (usrnm, pswd) => {
    // data enough
    if(!usrnm || !pswd)
    {
        throw new Error('Insufficient user data')
    }

    // avoid duplicities
    if(JB.find_element((x) => { return x.username == usrnm;}))
    {
        throw new Error('There is already a user registered with ' + usrnm + ' name.')
    }

    // add the user
    JB.add_element({username: usrnm, password: pswd});
}

module.exports.removeUser = (usrnm) => {

    let id = JB.find_element((x) => { return x.username == usrnm;});

    if (id)
    {
        JB.remove_element(id);

        // remove the associated tokens
        at.removeByUserId(id);
        rt.removeByUserId(id);
        ac.removeByUserId(id);
    }
    else
    {
        throw new Error('User Not Found');
    }
}

module.exports.findById = (id, done) => {

    try {
        return JB.get_element(id,done);      
    } catch (err) {
        return done(new Error('User Not Found'));
    }

};

module.exports.returnNextId = (id) => {
    return JB.next_id(id);
};

module.exports.findByUsername = (username, done) => {

    let id = JB.find_element((x) => { return x.username == username;});

    if (done == null)
    { // if not functor is provided return id
       return id; 
    }
    else if (id)
    {
        return JB.get_element(id, done);
    }

    return done(new Error('User Not Found'));
};
