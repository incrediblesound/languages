angular.module('myApp.services')
  .factory('Session', function($state){
    var create = function(user){
      this.user = user;
    }
    var destroy = function(){
      this.user = null;
    }
    var get = function(){
      return this.user;
    }
    var auth = function(){
      if(!this.user){
        $state.go('login');
      }
    }
    
    return {
      create: create,
      destroy: destroy,
      get: get,
      auth: auth
    }
  })