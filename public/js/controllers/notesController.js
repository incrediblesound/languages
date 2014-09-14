angular.module('myApp.controllers')
.controller('notesController', function($scope, $state, $http, dictionary, Auth, word, Complete){

  $scope.input; $scope.isAdmin; $scope.inputArray; $scope.complete; $scope.definitions;
  $scope.meaning; $scope.id;

  if(prefixTree === undefined){ var prefixTree = new Radix(); }

  Auth.auth().then(function(response){ $scope.isAdmin = response.data; })

  dictionary.get(['words','structures','notes']).then(function(response){
    $scope.words = response[0].data; $scope.structures = response[1].data; $scope.notes = response[2].data;
    Complete.load($scope.words);
  });

  $scope.$watch('input', function(newValue, oldValue){
    if(newValue !== undefined){
      if(newValue !== ''){
        var inputArray = newValue.split(' ');
        $scope.inputArray = inputArray;
        var last = inputArray[inputArray.length-1];
        Complete.input(last);
        $scope.complete = Complete.complete(); 
      }
    }
  })

  $scope.$watch('complete', function(newValue, oldValue){
    if(newValue !== undefined && newValue !== ''){
      var words = newValue.slice();
      Complete.genDefs(words);
      $scope.definitions = Complete.definitions();
    } 
  })

  $scope.merge = function(id){
    $http.get('/api/merge/'+id).then(function(response){
      $state.go($state.$current, null, { reload: true });
    });
  }

  $scope.destroy = function(id){
    $http.get('/api/deleteNote/'+id).then(function(response){
      $state.go($state.$current, null, { reload: true });
    })
  }

  $scope.passtoEdit = function(content, meaning, id){
    $scope.input = content;
    $scope.meaning = meaning;
    $scope.id = id;
  }

})