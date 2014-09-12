angular.module('myApp.services')
  .factory('note', function(utils){
  	var getOneNote = utils.getOne('/api/get-note/');
  	var getAllNotes = utils.getAll('/api/note-data');
  	var newNotes = utils.getAll('/api/new-notes');

    var getNotesById = function(array, cb, result){
      result = result || [];
      var current = array.shift();
      getOneNote(current).then(function(response){
        console.log(response);
        var note = response.data;
        result.push(note);
        if(array.length){
          return getNotesById(array, result)
        } else {
          return cb(result);
        }
      })
    }

  	return {
      getOne: getOneNote,
      getAll: getAllNotes,
      newNotes: newNotes,
      getNotesById: getNotesById
    }
  })