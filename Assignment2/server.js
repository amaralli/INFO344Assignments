var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');

var authInfo = require('./secret/oauth.json');
var callback = authInfo.callbackUrl;

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
    clientID: authInfo.clientID,
    clientSecret: authInfo.clientSecret,
    callbackURL: authInfo.callbackUrl
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
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

app.get('/auth/facebook/callback', passport.authenticate('facebook'), 
    function(req, res) {
 		res.redirect('static/secure/secure.html');
    }); 















