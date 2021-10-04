'use strict';

const path = require('path')
const fs = require('fs')

const at = require('./access_tokens');
const rt = require('./refresh_tokens');
const ac = require('./authorization_codes');

const state_dir = process.env.state || path.join(__dirname, "..", "state");
const JSONBackup = require('./json-backup');
let JB = new JSONBackup(path.join(state_dir, "clients.json"));

//const clients = [
//  { name: 'eProsima', clientId: 'eProsima', redirectUri: 'www.client.eprosima.com', clientSecret: 'SecretOfMonkeyIsland', isTrusted: false }
//];
// clientId is a key

module.exports.addClient = (name, clientId, redirect_uri, secret, trusted) => {
    // data enough
    if(!name || !clientId || !redirect_uri)
    {
        throw new Error('Insufficient client data')
    }

    if(secret == null)
    {
        secret = "";
    }

    if(trusted == null)
    {
        // ask the user for allowance
        trusted = false;
    }

    // avoid duplicities
    if(JB.find_element((x) => { return x.clientId == clientId;}))
    {
        throw new Error('There is already a client registered with ' + clientId + ' name.')
    }

    // add the client
    JB.add_element({
        name: name,
        clientId: clientId,
        redirectUri: redirect_uri,
        clientSecret: secret,
        isTrusted: trusted
    });
}

module.exports.removeClient = (clientId) => {

    let id = JB.find_element((x) => { return x.clientId == clientId;});

    if (id)
    {
        JB.remove_element(id);

        // remove the associated tokens
        at.removeByClientId(clientId);
        rt.removeByClientId(clientId);
        ac.removeByClientId(clientId);
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
        return done(new Error('Client Not Found'));
    }
};

module.exports.returnNextId = (id) => {
    return JB.next_id(id);
};

module.exports.findByClientId = (clientId, done) => {

    let id = JB.find_element((x) => { return x.clientId == clientId;});

    if (done == null)
    { // if not functor is provided return id
       return id; 
    }
    else if (id)
    {
        return JB.get_element(id, done);
    }

    return done(new Error('Client Not Found'));
};
