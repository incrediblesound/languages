
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

.controller('languageHomeController', function($scope, $http, $stateParams, Session, language, note){
  Session.auth();
  // $scope.data.lang = $stateParams.lang;
  language.getOne($stateParams.lang).then(function(response){
    $scope.language = response.data;
  });
  note.newNotes().then(function(response){
    $scope.notes = response.data;
  })
})

.controller('structuresController', function($scope, $http, Session, Auth, dictionary){
  Session.auth();
  $scope.formData = []; $scope.isAdmin;

  Auth.auth().then(function(response){ $scope.isAdmin = response.data; })

  dictionary.get(['classes','structures']).then(function(response){
    $scope.data = $scope.data || {};
    $scope.data.classes = response[0].data;
    $scope.data.classes.push({name:'Any'})
    $scope.data.structures = response[1].data;
  });

  $scope.goblins = function(data){
    console.log(data);
    $scope.formData.push(data);
    console.log($scope.formData)
  };

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