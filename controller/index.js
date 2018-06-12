'use strict';

module.exports = {
    index : function(request, response){
        response.render('index', {userLoggedIn : '', title: 'Attack on titan' });
    },
    login : function(request, response){
        response.render('login', {userLoggedIn : '', message :'', title: 'Login de aplicacion' });
    },
    rpg : function(request, response, userLoggedIn){
        response.render('users/rpg', {userLoggedIn : userLoggedIn || '', title: 'Attack on titan' })
    }
};