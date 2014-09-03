angular.module('myApp.services', []).factory('api', function ($http){
  var results = {};
  var apiMap = {
    'words': function(cb){
      $http.get('/api/word-data').success(function(data){
        return cb(data)
      })
    },
    'classes': function(cb){
      $http.get('/api/classes-data').success(function(data){
        return cb(data)
      })
    },
    'transforms': function(cb){
      $http.get('/api/transform-data').success(function(data){
        return cb(data)
      })
    },
    'structures': function(cb){
      $http.get('/api/structure-data').success(function(data){
        return cb(data)
      })
    },
    'notes': function(cb){
      $http.get('/api/note-data').success(function(data){
        return cb(data)
      })
    }
  };
  var getWord = function(id, cb){
    $http.get('/api/get-word/'+id).success(function(data){
      return cb(data);
    })
  }
  var getData = function(array, cb){
    var current = array.shift();
    apiMap[current](function(data){
      results[current] = data;
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