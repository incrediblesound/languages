angular.module('myApp.controllers')
.controller('dictionaryController', function($scope, $state, dictionary, word, note, Auth){

  $scope.isAdmin; $scope.examples;

  Auth.auth().then(function(response){ $scope.isAdmin = response.data; })

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
    $scope.examples = [];
    word.getOne(id).then(function(data){
      var word = data.data;
      console.log(word);
      note.getNotesById(word.examples, function(examples){
        $scope.data.view = word;
        $scope.examples = examples;
      })
    })
  };

})