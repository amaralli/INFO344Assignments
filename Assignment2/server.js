var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs')

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
//url-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
            } else {
                var newUser = new User();

                newUser.email = username;
                newUser.password = createHash(password);
                newUser.displayName = req.body.displayName;
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

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), 
    function(req, res) {
 		res.redirect('/secure.html');
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














