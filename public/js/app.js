angular.module('myApp', ['ngRoute','myApp.controllers','myApp.services'])
  .config(function ($routeProvider){
    $routeProvider.
      when('/signup', {
        templateUrl: '../views/entry.html',
        controller: 'entryController'
      }).
      when('/login', {
        templateUrl: '../views/login.html',
        controller: 'entryController'
      }).
      when('/home', {
        templateUrl: '../views/home.html',
        controller: 'homeController',
        resolve: {
          user_languages: function($http){
            return $http.get('/api/home-data').then(function(response){
              return response.data;
            })
          }
        }
      }).
      when('/language/:lang', {
        templateUrl: '../views/language-home.html',
        controller: 'languageHomeController'
      }).
      when('/dictionary', {
        templateUrl: '../views/dictionary.html',
        controller: 'dictionaryController'
      }).
      when('/structures', {
        templateUrl: '../views/structures.html',
        controller: 'structuresController'
      }).
      when('/new-transform/:word', {
        templateUrl: '../views/new-transform.html',
        controller: 'newTransformController'
      }).
      when('/notes', {
        templateUrl: '../views/note.html',
        controller: 'notesController'
      }).
      otherwise({
        redirectTo:'/login'
      });
  });