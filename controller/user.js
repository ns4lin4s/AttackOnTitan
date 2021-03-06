'use strict'
//Esto es mongoose, no se ocupara por ahora...
var User = require('./../model/user')

module.exports = {
    rpg : function(request, response) {
        var userLoggedIn = request.session.user;
        response.render('rpg', {message: '', userLoggedIn: userLoggedIn , user : userLoggedIn});
    },
    addUser : function (request, response) {
        response.render('addUser', {userLoggedIn : '', message : ''});
    },
    saveUser : function (request, response) {
        var user = new User(request.body);
        var error = user.validateSync();
        if(error){
            response.render('addUser', {message : error, userLoggedIn : ''})
        }else{
            user.save(function(err, data){
                if(err) {
                    response.render('addUser', {message: err, userLoggedIn: ''});
                }else {
                    response.redirect('/login');
                }
            });
        }
    },
    updateUserView : function (request, response) {
        var userLoggedIn = request.session.user;
        response.render('updateUser', {message: '', userLoggedIn: userLoggedIn , user : userLoggedIn});
    },
    updateUser : function (request, response) {
        var userLoggedIn = request.session.user;
        var user;
        User.findById(request.body.id, function(err, data) {
            if (err)
                console.log(err);
            user = data;
            user.name = request.body.name;
            user.username = request.body.username;
            if(request.body.password !== ''){
                user.password = request.body.password;
            }else{
                user.password = user.password;
            }
            var error = user.validateSync();
            if(error){
                response.render('updateUser', {message : error, userLoggedIn : userLoggedIn, user : userLoggedIn})
            }else{
                user.save(function(err, data){
                    if(err) {
                        response.render('updateUser', {message: err, userLoggedIn: userLoggedIn, user : userLoggedIn});
                    }else {
                        request.session.user = data;
                        response.redirect('/rpg');
                    }
                });
            }
        });

    },
    deleteUser : function (request, response) {
        var query = User.remove({_id : request.params.id});
        query.exec(function(err){
            if(err)
                console.log(err);
            response.redirect('/login');
        });
    },
    logout : function (request, response) {
        request.session.user = '';
        response.redirect('/');
    },
}