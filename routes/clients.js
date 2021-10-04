'use strict';

const clients = require('../db/clients');

const empty_options = {
    id: "",
    name: "",
    clientId: "",
    redirectUri: "",
    clientSecret: "",
    isTrusted: false 
};

function show_next_client(req, res)
{
    // check the current client
    let id = req.query.id;

    // get the next
    id = clients.returnNextId(id);
    let options = {};

    if( id != null )
    {
        clients.findById(id, (err, el) => {
            if(err) throw err;
            options.id = id;
            options = Object.assign(options, el);
            options.isTrusted = el.isTrusted
        });
    }
    else
    {
        options = empty_options;
    }

    res.render('clients', options);
}

function add_remove_or_update_client(req, res)
{
    let q = req.query;

    if ( q.id == '')
    { // if there is no index is an addition
        clients.addClient(
            q.client_name, 
            q.client_id, 
            q.redirect_uri, 
            q.client_secret, 
            q.client_trust != undefined); 

        q.id = clients.findByClientId(q.client_id);
    }
    else
    { // retrieve the object and process
        clients.findById(q.id, (err, el) => {
            // if the object was unmodified is a removal
            let equal = q.client_name == el.name &&
                q.client_id == el.clientId &&
                q.redirect_uri  == el.redirectUri &&
                q.client_secret == el.clientSecret &&
                (q.client_trust != undefined) == el.isTrusted;
            if (equal)
            { // remove
                clients.removeClient(el.clientId);
                q.id = null;
            }
            else
            { // update
                el.name = q.client_name;
                el.clientId = q.client_id;
                el.redirectUri = q.redirect_uri ;
                el.clientSecret = q.client_secret;

                // keep as boolean
                el.isTrusted = (q.client_trust != undefined);
            }
        });
    }

    if (q.id == null)
    {
        // blank
        res.render('clients', empty_options);
    }
    else
    {
        // render the actual values
        let options = {id: q.id};
        clients.findById(q.id, (err, el) => {
            if(err) throw err;
            options = Object.assign(options, el);
            options.isTrusted = el.isTrusted
            res.render('clients', options);
        });
    }
}

module.exports = (req, res) => {

    if(req.query.modify !== undefined)
    {
        add_remove_or_update_client(req, res);
    }
    else if(req.query.traverse !== undefined)
    {
        show_next_client(req, res);
    }
    else // this implies clear
    {
        // blank
        res.render('clients', empty_options);
    }
};
