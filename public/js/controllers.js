var makeWordArray = function(array){
  var results = [];
  for(var i = 0; i < array.length; i++){
    results.push(array[i].word);
    var transforms = array[i].transforms;
    if(transforms.length){
      for(var k = 0; k < transforms.length; k++){
        results.push(transforms[k].form);
      }
    }
  }
  return results;
}

angular.module('myApp.controllers', [])
.controller('entryController', function($scope, $location){})
.controller('homeController',function($scope, $http, language){
  $scope.languages = language;
})

.controller('languageHomeController', function($scope, $http, $routeParams){
  $scope.data = {};
  // $scope.data.lang = $routeParams.lang;
  $http.get('/api/get-language/' + $routeParams.lang).then(function(data){
    $scope.data.language = data.data;
  });
})

.controller('dictionaryController', function($scope, api){
  api.get(['classes', 'words', 'transforms']).then(function(response){
    $scope.data = $scope.data || {};
    $scope.data.classes = response[0];
    $scope.data.words = response[1];
    $scope.data.transforms = response[2];
  });
  $scope.display = function(word){
    api.getWord(word).then(function(data){
      $scope.data.view = data;
    })
  }
})

.controller('structuresController', function($scope, $http, api){
  $scope.data = {};
  $scope.data.formData = [];

  api.get(['classes','structures']).then(function(response){
    $scope.data.classes = response[0];
    $scope.data.structures = response[1];
  });

  $scope.goblins = function(data){
    console.log(data);
    $scope.data.formData.push(data);
    console.log($scope.data.formData)
  };

})

.controller('notesController', function($scope, $http, api){
  if(prefixTree === undefined){
    var prefixTree = new Radix();
  }
  $scope.data = {};
  $scope.data.input;
  $scope.data.output;
  api.get(['words','structures','notes']).then(function(response){
    $scope.data.words = response[0];
    $scope.data.structures = response[1];
    $scope.data.notes = response[2];
    var wordArray = makeWordArray(response[0]);
    prefixTree.documentInsert(wordArray, false);
  });
  $scope.assess = function(){
    if($scope.data.input !== undefined){
      if($scope.data.input !== ''){
        var inputArray = $scope.data.input.split(' ');
        var last = inputArray[inputArray.length-1];
        return prefixTree.complete(last);
      }
    }
  }
})

.controller('transformsController', function($scope, $http, api){
  $scope.data = {};
  api.get('transforms').then(function(response){
    $scope.data.transforms = response;
  });
})

.controller('newTransformController', function($scope, api, $routeParams){
  var word = $routeParams.word;
  $scope.data = {};
  $scope.data.word = word;
  $scope.counter = [1];
  api.getWord().then(function(data){
    $scope.data.wordText = data.word;
  })
  $scope.increment = function(){
    var last = $scope.counter[$scope.counter.length-1];
    $scope.counter.push(last+1);
  }
})