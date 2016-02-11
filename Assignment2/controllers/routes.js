'use strict';

/*
    All of the routes used for the http requests in this app
*/

var express = require('express');
var bCrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/mongo.js');

module.exports = function(passport) {

    //go to facebook for authentication
    router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    //recieve the user information, send the user to personalized page
    router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), 
        function(req, res) {
     		res.redirect('/profile.html');
        }); 

    //signs the user out, and redirects them to home
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/'); 
    });

    //loads the profile information for each user
    router.get('/profile', function(req, res) {
        res.json(req.user);
    });

    //logs a user in
    router.post('/api/login', passport.authenticate('local-login'),
        function(req, res) {
            res.json(req.user);
        });

    //updates a user's display name
    router.put('/api/updateDispl', function(req, res) {
        User.findOne({"email" : req.user.email}, function(err, user) {
            if(err) {
                return err;
            }

            //verifies user
            if(!user) {
                console.log("NOPE!");
                res.status("403").send("You're not you...");
            } else {
                //sets new user name
                user.displayName = req.body.displayName;

                //saves new user info
                user.save(function(err) {
                        if(err) {
                            return err
                        }
                    });
                res.json(req.user);
            }
        });
    });

    //updates a user's password
    router.put('/api/updatePass', function(req, res) {
        User.findOne({'email' : req.user.email}, function(err, user) {
            if(!user) {
                console.log("NOPE!");
                res.status("403").send("You're not you...");
            } else {
                //confirms that the user has entered the correct password
                if(!isValidPassword(user, req.body.oldPass)) {
                    console.log("wrong pass");
                    res.status("403").send("Wrong pass");
                } else {
                    //resets the password
                    console.log("correct pass, resetting pass");
                    user.password = createHash(req.body.newPass);
                    //saves the changes
                    user.save(function(err) {
                        if(err) {
                            return err
                        }
                    });
                    res.json(req.user);
                }
            }
        });
    });

    //signs a new user up
    router.post('/api/signup', passport.authenticate('local-signup'),
         function(req, res, next) {
            res.json(req.user);
        });

    //compares the given password and user's set pass
    var isValidPassword = function(user, password){
      return bCrypt.compareSync(password, user.password);
    }

    //creates a hash on entered pass
    var createHash = function(password){
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    return router;
}



