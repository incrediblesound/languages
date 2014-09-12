angular.module('myApp.controllers')
.controller('navigationController', function($scope, $state, Auth){
  $scope.logout = function(){
    console.log('hello');
    Auth.logout();
    $state.go('login');
  }
})