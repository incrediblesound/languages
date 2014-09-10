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
    return {
      login: login
    }
  })