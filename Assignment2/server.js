var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var mongoose = require('mongoose');

var authInfo = require('./secret/oauth.json');
var callback = authInfo.callbackUrl;

var User = require('./mongo.js');

var FacebookStrategy = require('passport-facebook').Strategy;

var cookieSigSecret = process.env.COOKIE_SIG_SECRET;
if (!cookieSigSecret) {
    console.error('Please set COOKIE_SIG_SECRET');
    process.exit(1);
}

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(session({
    secret: cookieSigSecret,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore()
}));

passport.use(new FacebookStrategy({
    clientID: '483767258477369',
    clientSecret: 'c90c60a65e24970bd0f5d79f3450b5e4',
    callbackURL: 'http://localhost:8080/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    //mongoose.model('User').findOne({ 'id': profile.id }, function (err, user) {
      //return cb(err, user);
    //});
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user); 
});
passport.deserializeUser(function(user, done) {
    done(null, user); 
});

app.use(passport.initialize());
app.use(passport.session());   

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), 
    function(req, res) {
 		res.redirect('/secure.html');
    }); 

app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/'); 
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
    }
    next();
        
});

//tell express to serve static files from the /static/secure
//subdirectory as well, but since this middleware function
//is added after the check above, express will never call it
//if the function above doesn't call next()
app.use(express.static(__dirname + '/static/secure'));

app.listen(80, function() {
    console.log('server is listening...');
});














