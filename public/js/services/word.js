angular.module('myApp.services')
  .factory('word', function(utils){
    var getOneWord = utils.getOne('/api/get-word/');
    var getAllWords = utils.getAll('/api/word-data');
    return {
      getOne: getOneWord,
      getAll: getAllWords
    }
  })