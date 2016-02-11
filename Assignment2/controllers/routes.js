'use strict';

var express = require('express');
var bCrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/mongo.js');

module.exports = function(passport) {
    router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), 
        function(req, res) {
     		res.redirect('/profile.html');
        }); 

    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/'); 
    });

    router.get('/profile', function(req, res) {
        res.json(req.user);
    });

    router.post('/api/login', passport.authenticate('local-login'/*, {failureRedirect: '/'}*/),
        function(req, res) {
            res.json(req.user);
            console.log('entered login');
            //res.redirect('/secure.html');
        });

    router.put('/api/updateDispl', function(req, res) {
        User.findOne({"email" : req.user.email}, function(err, user) {
            if(err) {
                return err;
            }
            if(!user) {
                console.log("NOPE!");
                res.status("403").send("You're not you...");
            } else {
                console.log(user.displayName);
                user.displayName = req.body.displayName;
                console.log(user.displayName);
                user.save(function(err) {
                        if(err) {
                            return err
                        }
                    });
                res.json(req.user);
            }
        });
    });

    router.put('/api/updatePass', function(req, res) {
        User.findOne({'email' : req.user.email}, function(err, user) {
            if(!user) {
                console.log("NOPE!");
                res.status("403").send("You're not you...");
            } else {
                console.log("Should not be null/undef: " + req.user.email);
                if(!isValidPassword(user, req.body.oldPass)) {
                    console.log("wrong pass");
                    res.status("403").send("Wrong pass");
                } else {
                    console.log("correct pass, resetting pass");
                    user.password = createHash(req.body.newPass);
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

    var isValidPassword = function(user, password){
      console.log("checkin local login");
      return bCrypt.compareSync(password, user.password);
    }

    var createHash = function(password){
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }


    router.post('/api/signup', passport.authenticate('local-signup'/*, { failureRedirect: '/signup.html'}*/),
         function(req, res, next) {
        //     //console.dir(req.user);
        //     req.login(req.user, function(err) {
        //         if(err) { return next(err); }
        //         return res.json(req.user);
        //     }); 
            console.log('redirecting to secure home page');
        //     //res.redirect('/secure.html');
            res.json(req.user);
        });

    console.log("why u no enter");
    return router;
}