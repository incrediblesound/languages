angular.module('myApp.services')
.factory('dictionary', function ($q, word, note, Class, structure){
  var map = {
    'words': word.getAll,
    'classes': Class.getAll,
    'notes': note.getAll,
    'structures': structure.getAll
  };
  return {
    get: function(request){
      if(angular.isString(request)){
        return map[request]();
      }
      else if(angular.isArray(request) || angular.isObject(request)){
        var results = angular.isArray(request) ? [] : {};
        angular.forEach(request, function(value, key){
          results[key] = map[value]();
        })
        return $q.all(results);
      }
    }
  }
})