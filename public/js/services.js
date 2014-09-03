angular.module('myApp.services', []).factory('api', function ($http){
  var results = {};
  var apiMap = {
    'words': function(){
      return $http.get('/api/word-data')
    },
    'classes': function(){
      return $http.get('/api/classes-data');
    },
    'transforms': function(cb){
      return $http.get('/api/transform-data')
    },
    'structures': function(cb){
      return $http.get('/api/structure-data')
    },
    'notes': function(cb){
      return $http.get('/api/note-data')
    }
  };

  var getWord = function(id, cb){
    $http.get('/api/get-word/'+id).success(function(data){
      return cb(data);
    })
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
  };
})