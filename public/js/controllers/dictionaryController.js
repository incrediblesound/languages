angular.module('myApp.controllers')
.controller('dictionaryController', function($scope, $state, dictionary, word){
  dictionary.get(['classes', 'words']).then(function(response){
    $scope.data = $scope.data || {};
    $scope.data.classes = response[0].data;
    $scope.data.words = response[1].data;
  });

  $scope.d = function(id){
    if(confirm('Are you sure you want to delete this word?')){
      word.deleteOne(id);
      $state.reload();
    }
  };

  $scope.display = function(id){
    console.log('hello');
    word.getOne(id).then(function(data){
      $scope.data.view = data.data;
    })
  };

})