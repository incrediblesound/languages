angular.module('myApp', ['ngRoute'])
  .config(function ($routeProvider){
    $routeProvider.
      when('/signup', {
        templateUrl: '../views/entry.html',
        controller: entryController
      }).
      when('/login', {
        templateUrl: '../views/login.html',
        controller: entryController
      }).
      when('/home', {
        templateUrl: '../views/home.html',
        controller: homeController
      }).
      when('/language/:lang', {
        templateUrl: '../views/language-home.html',
        controller: languageHomeController
      }).
      when('/classes', {
        templateUrl: '../views/classes.html',
        controller: classController
      }).
      when('/dictionary', {
        templateUrl: '../views/dictionary.html',
        controller: dictionaryController
      }).
      when('/structures', {
        templateUrl: '../views/structures.html',
        controller: structuresController
      }).
      when('/transforms', {
        templateUrl: '../views/transforms.html',
        controller: transformsController
      }).
      otherwise({
        redirectTo:'/signup'
      });
  });