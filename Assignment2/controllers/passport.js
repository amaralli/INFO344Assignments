'use strict';

var User = require('../models/mongo.js');
var bCrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy   = require('passport-local').Strategy;
var fbConfig = require('../secret/oauth.json');

module.exports = function(passport) {

    passport.use(new FacebookStrategy({
        clientID: fbConfig.clientID,
        clientSecret: fbConfig.clientSecret,
        callbackURL: fbConfig.callbackURL,
        profileFields: ['id', 'first_name', 'last_name', 'email']
      },
      function(accessToken, refreshToken, profile, cb) {
        process.nextTick(function() {
            User.findOne({'email' : profile._json.email}, function(err, user) {
                if(err) {
                    console.log('Error on oAuth signin' + 'err');
                    return done(err);
                }

                if(user) {
                    console.log("ERROR");
                    return cb(null, user);
                } else {
                    var newUser = new User();

                    newUser.id = profile.id;
                    console.log("Profile" + profile.id);
                    console.log("Real" + newUser.id);
                    //newUser.email = profile.emails[0].value;
                    newUser.email = profile._json.email;
                    console.log("Profile" + profile._json.email);
                    console.log("Real" + profile._json.email);
                    //newUser.firstName = profile.name.givenName;
                    //newUser.firstName = profile._json.first_name;
                    console.log("Profile" + profile._json.first_name);
                    console.log("Real" + profile._json.first_name);
                    newUser.password = guid();
                    //newUser.lastName = profile.name.familyName;
                    //newUser.lastName = profile._json.last_name;
                    console.log("Profile" + profile._json.last_name);
                    console.log("Real" + profile._json.last_name);
                    newUser.displayName = profile._json.first_name + " " + profile._json.last_name;
                    var gravHash = crypto.createHash('md5').update(newUser.email).digest('hex');
                    newUser.gravatarUrl = "http://www.gravatar.com/avatar/" + gravHash;


                    
                    newUser.oAuth = true;

                    newUser.save(function(err) {
                        if(err) {
                            console.log("Error saving user" + err);
                            throw err;
                        }
                        console.log(newUser);
                        return cb(null, newUser);
                    });
                }
            });
        });
        //return cb(null, profile);
      }));

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    passport.use('local-signup', new LocalStrategy({
         usernameField: 'email',
         passReqToCallback : true 
     }, function(req, username, password, done) {
        console.log('entered local strategy callback');
        if(req.body.confirmPass == req.body.password) {
            
            User.findOne({'email' : username}, function(err, user) {
                if(err) {
                    console.log("Error on signin" + 'err');
                    return done(err);
                } 
                console.log(user);
                if(user) {
                    //SIGN THE USER IN HERE
                    console.log("how did you get here.");
                    return done(null, false);
                } else {
                    var newUser = new User();

                    newUser.email = username;
                    newUser.password = createHash(password);
                    var gravHash = crypto.createHash('md5').update(username).digest('hex');
                    newUser.gravatarUrl = "http://www.gravatar.com/avatar/" + gravHash;
                    newUser.displayName = req.body.displayName;
                    newUser.oAuth = false;
                    console.log("ended up creating a user");

                    newUser.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+ err);  
                            throw err;  
                        }
                        console.log('User Registration succesful');  
                        return done(null, newUser);
                    });
                }
                
            });
        } else {
            console.log("passwords need to match");
            return done(null, false);
        }
     }));

     passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    }, function(req, username, password, done) {
        console.log('made it into local login');
        User.findOne({'email' : username}, function(err, user){
            if (err) { 
                console.log("error");
                return done(err); 
            }
            if (!user) {
              console.log('User Not Found with username ' + username);
              return done(null, false);                 
            }
            // User exists but wrong password, log the error 
            if(user.oAuth) {
                console.log('User is a facebook user');
                return done(null, false);
            }
            if (!isValidPassword(user, password)){
              console.log('Invalid Password');
              return done(null, false);
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            console.log("made it to the end?");
            console.log(user);
            return done(null, user);
        });

    }));

    var isValidPassword = function(user, password){
      console.log("checkin local login");
      return bCrypt.compareSync(password, user.password);
    }

    var createHash = function(password){
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
