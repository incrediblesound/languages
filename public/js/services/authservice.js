angular.module('myApp.services')
  .factory('Auth', function($http, $state, Session){
    var login = function(credentials, url){
      $http.post(url, credentials).then(function(data){
        var user = data.data;
        if(!user){
          $state.go('login');
        } else {
          $state.go('home');  
        }
      })
    }

    var logout = function(){
      $http.get('/logout')
    }

    var auth = function(){
      return $http.get('/api/authenticate/');
    }

    return {
      login: login,
      logout: logout,
      auth: auth
    }
  })