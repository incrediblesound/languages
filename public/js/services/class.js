angular.module('myApp.services')
  .factory('Class', function(utils){
  	var getOneClass = utils.getOne('/api/get-class/');
  	var getAllClasses = utils.getAll('/api/classes-data');
  	return {
      getOne: getOneClass,
      getAll: getAllClasses
    }
  })