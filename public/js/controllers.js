function entryController($scope, $location){}

function homeController($scope, $http){
  $scope.data = {};
  $http.get('/api/home-data').success(function(data){
    $scope.data.languages = data.results;
  });
}

function languageHomeController($scope, $http, $routeParams){
  $scope.data = {};
  // $scope.data.lang = $routeParams.lang;
  $http.get('/api/get-language/' + $routeParams.lang).success(function(data){
    data = JSON.parse(data);
    console.log(data.wordCount);
    $scope.data.language = data;
  });
}

function classController($scope, $http){
  $scope.data = {};
  $http.get('/api/classes-data').success(function(data){
    console.log(data);
    $scope.data.classes = data;
  });
}

function dictionaryController($scope, $http){
  $scope.data = {};
  $http.get('/api/word-data').success(function(data){
    $scope.data.words = data;
    $http.get('/api/classes-data').success(function(data){
      console.log(data);
      $scope.data.classes = data;
    });
  });
}

function structuresController($scope, $http){
  $scope.data = {};
  $http.get('/api/structures-data').success(function(data){
    $scope.data.structures = data;
  });
}

function transformsController($scope, $http){
  $scope.data = {};
  $http.get('/api/transforms-data').success(function(data){
    $scope.data.transforms = data;
  });
}