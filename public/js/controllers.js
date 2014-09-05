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
.controller('homeController',function($scope, $http, user_languages){
  $scope.languages = user_languages;
})

.controller('languageHomeController', function($scope, $http, $routeParams, language){
  $scope.data = {};
  // $scope.data.lang = $routeParams.lang;
  language.getOne($routeParams.lang).then(function(data){
    $scope.data.language = data.data;
  });
})

.controller('dictionaryController', function($scope, dictionary, word){
  dictionary.get(['classes', 'words']).then(function(response){
    $scope.data = $scope.data || {};
    $scope.data.classes = response[0].data;
    $scope.data.words = response[1].data;
  });
  $scope.display = function(id){
    word.getOne(id).then(function(data){
      $scope.data.view = data.data;
    })
  }
})

.controller('structuresController', function($scope, $http, dictionary){
  $scope.formData = [];

  dictionary.get(['classes','structures']).then(function(response){
    $scope.data = $scope.data || {};
    $scope.data.classes = response[0].data;
    $scope.data.structures = response[1].data;
  });

  $scope.goblins = function(data){
    console.log(data);
    $scope.formData.push(data);
    console.log($scope.formData)
  };

})

.controller('notesController', function($scope, $http, dictionary){
  if(prefixTree === undefined){
    var prefixTree = new Radix();
  }
  $scope.data = {};
  $scope.data.input;
  $scope.data.output;
  dictionary.get(['words','structures','notes']).then(function(response){
    $scope.data.words = response[0].data;
    $scope.data.structures = response[1].data;
    $scope.data.notes = response[2].data;
    var wordArray = makeWordArray(response[0].data);
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

.controller('newTransformController', function($scope, word, $routeParams){
  var id = $routeParams.word;
  $scope.data = {};
  $scope.data.word = word;
  $scope.counter = [1];
  word.getOne(id).then(function(data){
    $scope.data.wordText = data.data.word;
  })
  $scope.increment = function(){
    var last = $scope.counter[$scope.counter.length-1];
    $scope.counter.push(last+1);
  }
})