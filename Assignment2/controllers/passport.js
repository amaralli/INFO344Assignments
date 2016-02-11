'use strict';

/*
    This handles the passport functionality of this app. This means that it handles the session authentication 
    with each route a user can take- facebook authentication, local sign in and local sign up.
    See each passport use to see their individual functionality.
*/


//set up basic requirements and dependencies
var User = require('../models/mongo.js');
var bCrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy   = require('passport-local').Strategy;
var fbConfig = require('../secret/oauth.json');

module.exports = function(passport) {

    //begin facebook authentication
    //information needs to be set online, with facebook's dev portal
    //and saved to a secret folder
    passport.use(new FacebookStrategy({
        clientID: fbConfig.clientID,
        clientSecret: fbConfig.clientSecret,
        callbackURL: fbConfig.callbackURL,
        profileFields: ['id', 'first_name', 'last_name', 'email']
      },
      function(accessToken, refreshToken, profile, cb) {
        //delays functionality one run, to ensure that Facebook has properly been accessed
        process.nextTick(function() {
            //looks to see if a user with those credentials has already entered the system
            User.findOne({'email' : profile._json.email}, function(err, user) {
                //if an error occurs, throw that error
                if(err) {
                    console.log('Error on oAuth signin' + 'err');
                    return done(err);
                }

                //if the user already exists, allow facebook authorization to
                //continue, but do not re-save their information in the database
                if(user) {
                    console.log("User exists in database");
                    return cb(null, user);
                } else {
                    //if the user has never accessed the service before
                    //create a user entity for them, so the user can
                    //use and change personalized data
                    var newUser = new User();

                    //set the basic information for the user
                    newUser.id = profile.id;
                    newUser.email = profile._json.email;
                    newUser.oAuth = true;

                    //In the schema I built, password was required. Theoretically, I could have created two schemas
                    //one for FB and one for local, but I wanted to try and simplify my code.
                    //so, I created a long password for them
                    //however, the signin page will not allow them to sign in if they are an oAuth account, even if they
                    //somehow hacked the system and found the password created for them
                    newUser.password = guid();

                    //creates a display name based off of their FB account info
                    newUser.displayName = profile._json.first_name + " " + profile._json.last_name;

                    //create a gravatar url based off of their email
                    var gravHash = crypto.createHash('md5').update(newUser.email).digest('hex');
                    newUser.gravatarUrl = "http://www.gravatar.com/avatar/" + gravHash;


                    /*
                    Test code to make sure the database saved everything. I'm leaving this in here
                    to commemorate the hours lost in the battle to save this information. RIP.

                    console.log("Profile" + profile.id);
                    console.log("Real" + newUser.id);
                    console.log("Profile" + profile._json.email);
                    console.log("Real" + profile._json.email);
                    console.log("Profile" + profile._json.first_name);
                    console.log("Real" + profile._json.first_name);
                    console.log("Profile" + profile._json.last_name);
                    console.log("Real" + profile._json.last_name);
                    */

                    //save the new user
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
      }));

    //creates a secure password
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    //creates a new user account in the system, based off of the user's preferences
    passport.use('local-signup', new LocalStrategy({
         usernameField: 'email',
         passReqToCallback : true 
     }, function(req, username, password, done) {
        console.log('entered local strategy callback');
        //makes sure that no passwords with typos end up in the database
        if(req.body.confirmPass == req.body.password) {
            
            User.findOne({'email' : username}, function(err, user) {
                if(err) {
                    console.log("Error on signin" + 'err');
                    return done(err);
                } 

                //if the email is already being used for an account, it will not allow the user to create a new
                //account with the same email
                if(user) {
                    console.log("User already exists");
                    return done(null, false);
                } else {
                    //creates a new user if the email hasn't been used before, and if the passwords match
                    var newUser = new User();

                    newUser.email = username;
                    newUser.password = createHash(password);
                    var gravHash = crypto.createHash('md5').update(username).digest('hex');
                    newUser.gravatarUrl = "http://www.gravatar.com/avatar/" + gravHash;
                    newUser.displayName = req.body.displayName;
                    newUser.oAuth = false;
                    console.log("End user create");

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
    
    //logs user  in
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
                //if there is no user with that email, report an error
                if (!user) {
                  console.log('User Not Found with username ' + username);
                  return done(null, false);                 
                }
                // User exists, but should sign in through oAuth
                if(user.oAuth) {
                    console.log('User is a facebook user');
                    return done(null, false);
                }

                //user entered incorrect password
                if (!isValidPassword(user, password)){
                  console.log('Invalid Password');
                  return done(null, false);
                }

                // User and password both match, return the user's info
                return done(null, user);
            });

    }));
    
    //checks hashes
    var isValidPassword = function(user, password){
      console.log("checkin local login");
      return bCrypt.compareSync(password, user.password);
    }

    //creates hashes
    var createHash = function(password){
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
