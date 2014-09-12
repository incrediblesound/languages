angular.module('myApp')
.directive('myNav', function() {
  return {
    restrict: 'E',
    templateUrl: '/directives/navbar.html'
  }
});
