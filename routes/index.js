var express = require('express');
var router = express.Router();
var indexController = require('./../controller/index');
var passport = require('passport');

/* GET index page. */
router.get('/', indexController.index)

/* GET login page. */
router.get('/login', indexController.login)

/* Verify user login. */
router.post('/login', function(request, response, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            var message = "Invalid credentials"
            return response.render('login', {message: info.message, userLoggedIn: null})
        }
        request.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            request.session.user = user
            response.redirect('/users/rpg')
        });
    })(request, response, next)
})

/* Login using facebook */
router.get('/auth/facebook',passport.authenticate('facebook', { scope : ['email'] }))
router.get('/auth/facebook/callback', function(request, response, next) {
    passport.authenticate('facebook', function (err, user, info) {
      console.log('callback',user,info)
        if (err) {
            return next(err)
        }
        // Successful authentication, redirect home.
        if (!user) {
            var message = "Invalid credentials"
            // response.redirect('/login');
            return response.render('login', {message: info.message, userLoggedIn: null})
        }
        request.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            request.session.user = user
            response.redirect('/users/rpg')
        });
    })(request, response, next)
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Attack on Titan' })
})

module.exports = router