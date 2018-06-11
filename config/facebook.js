var passport = require('passport'),
    facebookStrategy = require('passport-facebook').Strategy,
    User = require('./../model/user');

module.exports = function () {
    passport.use(new facebookStrategy({
        clientID: '197321351087575',
        clientSecret: '01e8eecb6d8556798821e9933a182d3f',
        callbackURL: "http://localhost:9999/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name']
    }, function(accessToken, refreshToken, profile, cb){
        User.findOne({ facebookId : profile.id }, function (err, user) {
            if(err){
                return cb(err, false, {message : err});
            }else {
                if (user != '' && user != null) {
                    return cb(null, user, {message : "User "});
                } else {
                    var userData = new User({
                        name : profile.name.givenName,
                        email : profile.emails[0].value,
                        password : '1234567',
                        facebookId : profile.id,
                    });
                    console.log('userData',userData)
                    // send email to user just in case required to send the newly created
                    // credentails to user for future login without using facebook login
                    userData.save(function (err, newuser) {
                        console.log('newuser Save',newuser)
                        if (err) {
                            return cb(null, false, {message : err + " !!! Please try again"});
                        }else{
                            return cb(null, newuser);
                        }
                    });
                }
            }
        });
    }));
};