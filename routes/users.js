'use strict';

const users = require('../db/users');

const empty_options = {
    id: "",
    username: "",
    password: ""
};

function show_next_user(req, res)
{
    // check the current 
    let id = req.query.id;

    // get the next
    id = users.returnNextId(id);
    let options = {};

    if( id != null )
    {
        users.findById(id, (err, el) => {
            if(err) throw err;
            options.id = id;
            options = Object.assign(options, el);
        });
    }
    else
    {
        options = empty_options;
    }

    res.render('users', options);
}

function add_remove_or_update_user(req, res)
{
    let q = req.query;

    if ( q.id == '')
    { // if there is no index is an addition
        users.addUser(
            q.user_name, 
            q.user_password); 

        q.id = users.findByUsername(q.user_name);
    }
    else
    { // retrieve the object and process
        users.findById(q.id, (err, el) => {
            // if the object was unmodified is a removal
            let equal = q.user_name == el.username &&
                q.user_password == el.password;
            if (equal)
            { // remove
                users.removeUser(el.username);
                q.id = null;
            }
            else
            { // update
                el.username = q.user_name;
                el.password = q.user_password;
            }
        });
    }

    if (q.id == null)
    {
        // blank
        res.render('users', empty_options);
    }
    else
    {
        // render the actual values
        let options = {id: q.id};
        users.findById(q.id, (err, el) => {
            if(err) throw err;
            options = Object.assign(options, el);
            res.render('users', options);
        });
    }
}

module.exports = (req, res) => {

    if(req.query.modify !== undefined)
    {
        add_remove_or_update_user(req, res);
    }
    else if(req.query.traverse !== undefined)
    {
        show_next_user(req, res);
    }
    else // this implies clear
    {
        // blank
        res.render('users', empty_options);
    }
};
