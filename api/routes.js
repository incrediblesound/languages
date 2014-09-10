var mongoose = require('mongoose');
var User = mongoose.model('user');
var Language = mongoose.model('language');
var Word = mongoose.model('word');
//var Transform = mongoose.model('transform');
var Structure = mongoose.model('structure');
var Class = mongoose.model('class');
var Note = mongoose.model('note');

module.exports = function(app){

  app.post('/signup', function(req, res){
    console.log(req.body);
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      if(user){
        res.redirect('/#/login');
      } else {
        new User({username: req.body.username, password: req.body.password}).save(function(err, newUser){
          console.log(newUser);
          req.session.user = newUser.username;
          var data = JSON.stringify({user: newUser.username});
          res.end(data);
        });
      }
    });
  });

  app.post('/login', function(req, res){
    console.log(req.body);
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      console.log(user);
      if(user === null){
        console.log('if null')
        res.redirect('#/signup');
      } else {
        console.log('user exists')
        req.session.user = user.username;
        var data = JSON.stringify({user: user.username})
        res.end(data);
      }
    });
  });

  app.get('/create_session', function(req, res){
    var data = JSON.stringify({user: req.session.user})
    res.end(data);
  })

  app.get('/api/home-data', function(req, res){
    Language.find({createdBy: req.session.user}, function(err, user_languages){
      if(err){ console.log(err) }
      Language.find().sort('-created_at').limit(5).exec(function(err, new_languages){
        if(err){ console.log(err) }
        Note.find({writtenBy: req.session.user}).limit(5).exec(function(err, notes){
          if(err){ console.log(err) }
          var data = JSON.stringify({user: user_languages, newLangs: new_languages, contribs: notes});
          res.end(data);
        })
      })
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
    new Language({createdBy: req.session.user, name: req.body.name}).save(function(err, data){
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
      classes: classes,
      lang: req.session.language
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
      res.redirect('/#/structures');
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
    console.log(req.session);
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
    Note.find({lang: req.session.language, writtenBy: req.session.user}, function(err, data){
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
    Word.update({_id: data.word}, { $pushAll: {transforms: formArray} }, function(err){
      if(err){ console.log(err) }
      res.redirect('/#/dictionary');
    })
  })

  app.post('/api/new-structure', function(req, res){
    new Structure({
      name: req.body.name,
      parts: req.body.parts,
      explanation: req.body.explanation,
      lang: req.session.language
    }).save(function(err){
      if (err){ console.log(err); }
      res.redirect('/#/structures');
    })
  })

  app.post('/api/new-note', function(req, res){
    new Note({
      lang: req.session.language,
      content: req.body.content,
      meaning: req.body.meaning,
      writtenBy: req.session.user
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

  app.get('/api/get-wordname/:name', function(req, res){
    var name = req.params.name;
    Word.findOne({word: name}, function(err, data){
      if(err){ console.log(err); }
      console.log(data);
      data = JSON.stringify(data);
      res.end(data);
    })
  })

  app.get('/api/delete-word/:id', function(req, res){
    var id = req.params.id;
    Word.findOne({_id: id}).remove(function(err){
      if(err){ console.log(err); }
      res.end();
    })
  })

  return app;

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