angular.module('myApp.services')
  .factory('note', function(utils){
  	var getOneNote = utils.getOne('/api/get-note/');
  	var getAllNotes = utils.getAll('/api/note-data');
  	return {
      getOne: getOneNote,
      getAll: getAllNotes
    }
  })