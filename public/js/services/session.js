angular.module('myApp.services')
  .factory('Session', function($state, $http){

    var user = function(){
      return $http.get('/create_session')
    }

    var user_owns = function(){
      return $http.post('/user_languages/'+this.user);
    }
    
    return {
      get: function(){
        return user().then(function(response){
          return response.data.user;
        })
      },
      auth: function(){
        return user().then(function(response){
          var user = response.data.user;
          if(user){
            return;
          } else {
            $state.go('login');
          }
        })
      }
    }
  })