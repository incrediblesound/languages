angular.module('myApp.services')
  .factory('language', function(utils){
  	var getOneLanguage = utils.getOne('/api/get-language/');
  	var getAllLanguages = utils.getAll('/api/language-data');
  	return {
      getOne: getOneLanguage,
      getAll: getAllLanguages
    }
  })