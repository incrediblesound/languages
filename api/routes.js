var mongoose = require('mongoose');
var User = mongoose.model('user');
var Language = mongoose.model('language');
var Word = mongoose.model('word');
var Transform = mongoose.model('transform');
var Structure = mongoose.model('structure');
var Class = mongoose.model('class');

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
      console.log(data);
      if(!data.length || data === undefined){
        var obj = [{name:'No languages yet.'}];
        data = JSON.stringify({results: obj});
        console.log(data);
      }
      req.session.languages = data;
      data = JSON.stringify({results: data});
      res.end(data);
    });
  });

  app.get('/api/get-language/:lang', function(req, res){
    var key = req.params.lang;
    Language.findOne({name: key}, function(err, lang){
      var data = JSON.stringify(lang);
      res.end(data);
    })
  });

  app.post('/api/new-language', function(req, res){
    console.log(req.body);
    new Language({createdBy: req.session.username, name: req.body.name}).save(function(err, data){
      req.session.language = data.name; //this is probably not needed
      res.redirect('/#/language/'+data.name);
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

  app.post('/api/new-word', function(req, res){
    var word = req.body, classes;
    if(!Array.isArray(word.classes)){
      classes = [].push(word.classes);
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

  app.get('/api/classes-data', function(req, res){
    Class.find({lang: req.session.language}, function(err, data){
      console.log(err);
      data = JSON.stringify(data);
      res.end(data);
    });
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

  app.get('/api/transform-data', function(req, res){
    Transform.find({lang: req.session.language}, function(err, data){
      console.log(data);
      data = JSON.stringify(data);
      res.end(data);
    });
  });

  app.post('/api/new-transform', function(req, res){
    var data = req.body;
    var formArray = [];
    forEach(data.form, function(form, i){
      formArray.push({form: form, meaning: data.meaning[i]})
    })
    new Transform({forms: formArray, lang: req.session.language}).save(function(err, data){
      res.redirect('/#/dictionary');
    })
  })

  app.get('/api/get-word/:id', function(req, res){
    var id = req.params.id;
    Word.findOne({_id: id}, function(err, data){
      if(err){ console.log(err); }
      data = {word: data.word};
      data = JSON.stringify(data);
      res.end(data);
    })
  })

  app.get('/api/structure-data', function(req, res){
    Structure.find({lang: req.session.language}, function(err, data){
      console.log(data);
      data = JSON.stringify(data);
      res.end(data);
    });
  });
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