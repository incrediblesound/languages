require('../db.js');
var mongoose = require('mongoose');
var User = mongoose.model('user');
var Language = mongoose.model('language');
var Word = mongoose.model('word');
var Transform = mongoose.model('transform');
var Structure = mongoose.model('structure');
var Class = mongoose.model('class');
var Note = mongoose.model('note');

module.exports = function(app){

  app.post('/api/signup', function(req, res){
    console.log(req.body);
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      if(user){
        res.redirect('/#/login');
      } else {
        new User({username: req.body.username, password: req.body.password}).save(function(err, newUser){
          console.log(newUser);
          req.session.user = user;
          res.redirect('/#/home');
        });
      }
    });
  });

  app.post('/api/login', function(req, res){
    console.log(req.body);
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      if(!user){
        res.redirect('/#/signup');
      } else {
        req.session.user = user;
        res.redirect('/#/home');
      }
    });
  });

  app.get('/api/home-data', function(req, res){
    Language.find({createdBy: req.session.username}, function(err, data){
      if(!data.length || data === undefined){
        var obj = [{name:'No languages yet.'}];
        data = JSON.stringify({results: obj});
      }
      data = JSON.stringify(data);
      res.end(data);
    });
  });

  app.get('/api/get-language/:lang', function(req, res){
    var key = req.params.lang;
    Language.findOne({name: key}, function(err, data){
      req.session.language = data.name; 
      data = JSON.stringify(data);
      res.end(data);
    })
  });

  app.post('/api/new-language', function(req, res){
    console.log(req.body);
    new Language({createdBy: req.session.username, name: req.body.name}).save(function(err, data){
      req.session.language = data.name;
      res.redirect('/#/language/'+data.name);
    });
  });


  app.post('/api/new-word', function(req, res){
    var word = req.body, classes;
    console.log(word);
    if(!Array.isArray(word.classes)){
      classes = []
      classes.push(word.classes);
    } else {
      classes = word.classes;
    }
    new Word({
      word: word.word,
      definition: word.definition,
      classes: classes
    }).save(function(err, data){
      if(err){ console.log(err); }
      res.redirect('/#/dictionary')
    })
  });


  app.post('/api/new-class', function(req, res){
    new Class({
      lang: req.session.language, 
      name: req.body.className, 
      explanation: req.body.explanation
    }).save(function(err, data){
      console.log(data);
      //data = JSON.stringify(data);
      res.redirect('/#/classes');
    });
  });

  app.get('/api/structure-data', function(req, res){
    Structure.find({lang: req.session.language}, function(err, data){
      data = JSON.stringify(data);
      res.end(data);
    });
  });
  
  app.get('/api/transform-data', function(req, res){
    Transform.find({lang: req.session.language}, function(err, data){
      data = JSON.stringify(data);
      res.end(data);
    });
  });
  
  app.get('/api/word-data', function(req, res){
    Word.find({lang: req.session.language}, function(err, data){
      if(err){ console.log(err); }
      console.log('word data: ', data)
      data = JSON.stringify(data);
      res.end(data);
    });
  });

  app.get('/api/classes-data', function(req, res){
    Class.find({lang: req.session.language}, function(err, data){
      console.log('error: ', err);
      data = JSON.stringify(data);
      res.end(data);
    });
  });

  app.get('/api/note-data', function(req, res){
    Note.find({lang: req.session.language}, function(err, data){
      if(err){ console.log(err); }
      data = JSON.stringify(data);
      console.log(data);
      res.end(data);
    })
  })

  app.post('/api/new-transform', function(req, res){
    var data = req.body;
    if(Array.isArray(data.form)){
      var formArray = [];
      forEach(data.form, function(form, i){
        formArray.push({form: form, meaning: data.meaning[i]})
      })
    } else {
      formArray = [{form: data.form, meaning: data.meaning}];
    }
    Word.update({_id: req.body.word}, { $pushAll: {transforms: formArray} }, function(err){
      if(err){ console.log(err) }
      res.redirect('/#/dictionary');
    })
  })

  app.post('/api/new-structure', function(req, res){
    new Structure({
      name: req.body.name,
      parts: req.body.parts,
      explanation: req.body.explanation
    }).save(function(err){
      if (err){ console.log(err); }
      res.redirect('/#/structures');
    })
  })

  app.post('/api/new-note', function(req, res){
    new Note({
      lang: req.session.language,
      content: req.body.content,
      meaning: req.body.meaning
    }).save(function(err, data){
      res.redirect('/#/notes');
    })
  })

  app.get('/api/get-word/:id', function(req, res){
    var id = req.params.id;
    Word.findOne({_id: id}, function(err, data){
      if(err){ console.log(err); }
      data = JSON.stringify(data);
      res.end(data);
    })
  })

};

var filter = function(array, query){
  for(var i = 0; i < array.length; i++){
    if(query(array[i])){
      return array[i];
    }
  }
};

var forEach = function(array, fn){
  for(var i = 0; i < array.length; i++){
    fn(array[i], i);
  }
}