/*
make a 'words' factory that can get one or all
etc etc, then make meta-factories that inject
more specific factories
make a base-factory class is a service that has
some basic boilerplate functionality like 
resource.get()
*/

angular.module('myApp.services', [])
.factory('api', function ($http, $q){
  var results = {};
  var apiMap = {
    'words': '/api/word-data',
    'classes': '/api/classes-data',
    'transforms': '/api/transform-data',
    'structures': '/api/structure-data',
    'notes': '/api/note-data'
  };

  var getWord = function(id){
    return $http.get('/api/get-word/'+id).then(function(response){
      return response.data;
    });
  }

  var getData = function(array, cb){
    var current = array.shift();
    apiMap[current]().then(function(data){
      results[current] = data.data;
      if(!array.length){
        return cb(results);
      } else {
        return getData(array, cb);
      }
    })
  }
  return {
    getData: getData,
    getWord: getWord,
    get: function(request){
      if (angular.isString(request)) {
        return $http.get(apiMap[dataType]).then(function(res){
          return res.data;
        });
      } 
      else if (angular.isArray(request) || angular.isObject(request)){
        var results = angular.isArray(request) ? [] : {};
        angular.forEach(request, function(value, key){
          results[key] = $http.get(apiMap[value]).then(function(res){
            return res.data;
          })
        })
        return $q.all(results);
      }
    }
  };
})