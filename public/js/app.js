angular.module('myApp', ['ui.router','myApp.controllers','myApp.services'])
  .config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/signup');

    $stateProvider.
      state('signup', {
        url: '/signup',
        templateUrl: '../views/entry.html',
        controller: 'entryController'
      }).
      state('login', {
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'loginController'
      }).
      state('home', {
        url: '/home',
        templateUrl: '../views/home.html',
        controller: 'homeController',
        resolve: {
          home_data: function($http){
            return $http.get('/api/home-data').then(function(response){
              return response.data;
            })
          }
        }
      }).
      state('language_home', {
        url: '/language/:lang', 
        templateUrl: '../views/language-home.html',
        controller: 'languageHomeController'
      }).
      state('dictionary', {
        url: '/dictionary',
        templateUrl: '../views/dictionary.html',
        controller: 'dictionaryController'
      }).
      state('structures', {
        url: '/structures',
        templateUrl: '../views/structures.html',
        controller: 'structuresController'
      }).
      state('transforms', {
        url: '/new-transform/:word',
        templateUrl: '../views/new-transform.html',
        controller: 'newTransformController'
      }).
      // state('classes', {
      //   url: '/classes'
      // })
      state('notes', {
        url: '/notes',
        templateUrl: '../views/note.html',
        controller: 'notesController'
      });
  });