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

function entryController($scope, $location){}

function homeController($scope, $http){
  $scope.data = {};
  $http.get('/api/home-data').success(function(data){
    $scope.data.languages = data;
  });
}

function languageHomeController($scope, $http, $routeParams){
  $scope.data = {};
  // $scope.data.lang = $routeParams.lang;
  $http.get('/api/get-language/' + $routeParams.lang).success(function(data){
    $scope.data.language = data;
  });
}


function dictionaryController($scope, api){
  $scope.data = {};
  api.getData(['classes', 'words', 'transforms'], function(data){
    console.log(data);
    $scope.data.words = data.words;
    $scope.data.classes = data.classes;
    $scope.data.transforms = data.transforms;
  });
  $scope.display = function(word){
    api.getWord(word, function(data){
      console.log(data);
      $scope.data.view = data;
    })
  }
}

function structuresController($scope, $http, api){
  $scope.data = {};
  $scope.data.formData = [];

  api.getData(['classes','structures'], function(data){
    $scope.data.structures = data.structures;
    $scope.data.classes = data.classes;
  });

  $scope.goblins = function(data){
    console.log(data);
    $scope.data.formData.push(data);
    console.log($scope.data.formData)
  };

}

function notesController($scope, $http, api){
  if(prefixTree === undefined){
    var prefixTree = new Radix();
  }
  $scope.data = {};
  $scope.data.input;
  $scope.data.output;
  api.getData(['words','structures','notes'], function(data){
    $scope.data.words = data.words;
    $scope.data.structures = data.structures;
    $scope.data.notes = data.notes;
    var wordArray = makeWordArray(data.words);
    prefixTree.documentInsert(wordArray, false);
  })
  $scope.assess = function(){
    if($scope.data.input !== undefined){
      if($scope.data.input !== ''){
        var inputArray = $scope.data.input.split(' ');
        var last = inputArray[inputArray.length-1];
        return prefixTree.complete(last);
      }
    }
  }
}

function transformsController($scope, $http, api){
  $scope.data = {};
  api.getData(['transforms'], function(data){
    $scope.data.transforms = data.transforms;
  });
}

function newTransformController($scope, api, $routeParams){
  var word = $routeParams.word;
  $scope.data = {};
  $scope.data.word = word;
  $scope.counter = [1];
  api.getWord(word, function(data){
    $scope.data.wordText = data.word;
  })
  $scope.increment = function(){
    $scope.counter.push($scope.counter[$scope.counter.length-1]+1);
  }
}