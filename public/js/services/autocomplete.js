angular.module('myApp.services')
  .factory('Complete', function($http, word){

    var tree = tree || new Radix();
    var definitions = {};
    var complete;

    var makeArray = function(array){
      var results = [];
      for(var i = 0; i < array.length; i++){
        results.push(array[i].word);
        var transforms = array[i].transforms;
        if(transforms.length){
          for(var k = 0; k < transforms.length; k++){
            results.push(transforms[k].form);
          }
        }
      }
      return results;
    }

    var getDef = function(array){
      var name = array.shift();
      if(name !== undefined){
        word.getOneByName(name).then(function(response){
          definitions[name] = response.data.definition;
          if(!array.length){
            return;
          } else {
            getDef(array);
          }
        })
      }
    }

    var load = function(words){
      words = makeArray(words);
      tree.documentInsert(words);
    }

    var getCompletions = function(){
      return complete;
    }

    var getDefinitions = function(){
      return definitions;
    }

    var input = function(word){
      complete = tree.complete(word);
    }

    var genDefs = function(words){
      getDef(words);
    }

    return {
      load: load,
      complete: getCompletions,
      definitions: getDefinitions,
      input: input,
      genDefs: genDefs
    }
  })