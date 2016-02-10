var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var authInfo = require('./secret/oauth.json');
var callback = authInfo.callbackUrl;

var User = require('./mongo.js');

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy   = require('passport-local').Strategy;

var cookieSigSecret = process.env.COOKIE_SIG_SECRET;
if (!cookieSigSecret) {
    console.error('Please set COOKIE_SIG_SECRET');
    process.exit(1);
}

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: cookieSigSecret,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore()
}));

passport.use(new FacebookStrategy({
    clientID: '483767258477369',
    clientSecret: 'c90c60a65e24970bd0f5d79f3450b5e4',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['id', 'first_name', 'last_name', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {
        User.findOne({'id' : profile.id}, function(err, user) {
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
                newUser.firstName = profile._json.first_name;
                console.log("Profile" + profile._json.first_name);
                console.log("Real" + profile._json.first_name);
                newUser.password = "hhhhh";
                //newUser.lastName = profile.name.familyName;
                newUser.lastName = profile._json.last_name;
                console.log("Profile" + profile._json.last_name);
                console.log("Real" + profile._json.last_name);
                newUser.displayName = newUser.firstName + " " + newUser.lastName;
                console.log(newUser);
                newUser.oAuth = true;

                newUser.save(function(err) {
                    if(err) {
                        console.log("Error saving user" + err);
                        throw err;
                    }
                    return cb(null, newUser);
                });
            }
        });
    });
    return cb(null, profile);
  }));



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
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        console.log("made it to the end?");
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

passport.serializeUser(function(user, done) {
    done(null, user); 
});
passport.deserializeUser(function(user, done) {
    done(null, user); 
});

app.use(passport.initialize());
app.use(passport.session());   

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), 
    function(req, res) {
 		res.redirect('/profile.html');
    }); 

app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/'); 
});

app.get('/profile', function(req, res) {
    res.json(req.user);
});

app.post('/api/login', passport.authenticate('local-login'/*, {failureRedirect: '/'}*/),
    function(req, res) {
        res.json(req.user);
        console.log('entered login');
        //res.redirect('/secure.html');
    });

app.put('/api/updateDispl', function(req, res) {
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

app.put('/api/updatePass', function(req, res) {
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

app.post('/api/signup', passport.authenticate('local-signup'/*, { failureRedirect: '/signup.html'}*/),
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

//tell express to serve static files from the /static/public
//subdirectory (any user can see these)
app.use(express.static(__dirname + '/static/public'));

//add a middleware function to verify that the user is
//authenticated: if so, continue processing; if not,
//redirect back to the home page
app.use(function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect('/'); 
        console.log("got caught up in the middleware function");
    } else {
        next();
    }    
});

//tell express to serve static files from the /static/secure
//subdirectory as well, but since this middleware function
//is added after the check above, express will never call it
//if the function above doesn't call next()
app.use(express.static(__dirname + '/static/secure'));

app.listen(80, function() {
    console.log('server is listening...');
});














