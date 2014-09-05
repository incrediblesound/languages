angular.module('myApp.services')
  .factory('structure', function(utils){
  	var getOneStructure = utils.getOne('/api/get-structure/');
  	var getAllStructures = utils.getAll('/api/structure-data');
  	return {
      getOne: getOneStructure,
      getAll: getAllStructures
    }
  })