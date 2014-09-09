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
.controller('entryController', function($scope, $location, Auth){
  $scope.credentials = {};
  $scope.login = function(credentials){
    Auth.login(credentials, '/signup');
  }
})
.controller('loginController', function($scope, $location, Auth){
  $scope.credentials = {};
  $scope.login = function(credentials){
    Auth.login(credentials, '/login');
  }
})
.controller('homeController',function($scope, $state, $http, Session, home_data){
  Session.auth();
  $scope.languages = home_data.user;
  $scope.newLanguages = home_data.newLangs;
  $scope.contributions = home_data.contribs;
})

.controller('languageHomeController', function($scope, $http, $stateParams, Session, language){
  Session.auth();
  $scope.data = {};
  // $scope.data.lang = $stateParams.lang;
  language.getOne($stateParams.lang).then(function(data){
    $scope.data.language = data.data;
  });
})

.controller('structuresController', function($scope, $http, Session, dictionary){
  Session.auth();
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

.controller('notesController', function($scope, $http, dictionary, word){
  $scope.input;
  $scope.data = {};
  if(prefixTree === undefined){
    var prefixTree = new Radix();
  }
  dictionary.get(['words','structures','notes']).then(function(response){
    $scope.words = response[0].data;
    $scope.structures = response[1].data;
    $scope.notes = response[2].data;
    var wordArray = makeWordArray(response[0].data);
    prefixTree.documentInsert(wordArray, false);
  });

  $scope.assess = function(){
    if($scope.input !== undefined){
      if($scope.input !== ''){
        var inputArray = $scope.input.split(' ');
        var last = inputArray[inputArray.length-1];
        var complete = prefixTree.complete(last);
        angular.forEach(complete, function(wordName){
          if($scope.data[wordName] === undefined){
            word.getOneByName(wordName).then(function(response){
              response = response.data;
              $scope.data[response.word] = response.definition;
            })
          }
        })
      }
    }
  }
  // $scope.meaning = function(name){
  //   word.getOneByName(name).then(function(data){
  //     console.log(data.data);
  //     return 'ok';
  //   })
  // }
})

.controller('transformsController', function($scope, $http, Session){
  Session.auth();
  $scope.data = {};
  api.get('transforms').then(function(response){
    $scope.data.transforms = response;
  });
})

.controller('newTransformController', function($scope, word, Session, $stateParams){
  Session.auth();
  var id = $stateParams.word;
  $scope.data = {};
  $scope.data.word = id;
  $scope.counter = [1];
  word.getOne(id).then(function(data){
    $scope.data.wordText = data.data.word;
  })
  $scope.increment = function(){
    var last = $scope.counter[$scope.counter.length-1];
    $scope.counter.push(last+1);
  }
})