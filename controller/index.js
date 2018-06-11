'use strict';

module.exports = {
    index : function(request, response){
        response.render('index', {userLoggedIn : '', title: 'Learn Game Development at ZENVA.com' });
    },
    login : function(request, response){
        response.render('login', {userLoggedIn : '', message :'', title: 'Login de aplicacion' });
    },
    rpg : function(request, response, userLoggedIn){
        response.render('users/rpg', {userLoggedIn : userLoggedIn || '', title: 'Learn Game Dev AT Zenva.com' })
    }
};