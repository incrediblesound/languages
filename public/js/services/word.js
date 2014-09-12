angular.module('myApp.services')
  .factory('word', function(utils){
    var getOneWord = utils.getOne('/api/get-word/');
    var deleteOne = utils.getOne('/api/delete-word/');
    var getOneByName = utils.getOne('/api/get-wordname/');
    var getAllWords = utils.getAll('/api/word-data');

    return {
      getOne: getOneWord,
      deleteOne: deleteOne,
      getAll: getAllWords,
      getOneByName: getOneByName
    }
  })