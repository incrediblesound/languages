angular.module('myApp.services', [])
  .factory('utils', function($http){
    var getOne = function(url){
      return function(id){
        return $http.get(url+id)
      };
    };
    var getAll = function(url){
      return function(cb){
        return $http.get(url)
      }
    }
    return {
      getOne: getOne,
      getAll: getAll
    }
  })