require('./db.js');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('user');
var Language = mongoose.model('language');
var Word = mongoose.model('word');
var Structure = mongoose.model('structure');
var Class = mongoose.model('class');
var Note = mongoose.model('note');
var News = mongoose.model('news');

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
  app.use(session({
    secret: 'alien badminton',
    resave: true,
    saveUninitialized: true
  }));
  //app.engine('html', require('ejs').renderFile);
  app.use(express.static(__dirname+'/public'));

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

  var checkLanguage = function(req, res, next){
    if(req.session.language === undefined){
      res.redirect('/#/home');
    } else {
      next();
    }
  }

  app.post('/signup', function(req, res){
    console.log(req.body)
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      if(user){
        res.redirect('/#/login');
      } else {
        var hash = bcrypt.hashSync(req.body.password);
        console.log(hash);
        new User({username: req.body.username, password: hash}).save(function(err, newUser){
          console.log(err);
          var name = newUser.username
          req.session.user = name;
          new News({forUser: name, message: 'Welcome to Languages! Click "about" on the top of the page for help.'})
          res.redirect('/#/home');
        });
      }
    });
  });

  app.get('/logout', function(req, res){
    req.session.user = undefined;
    res.end();
  })

  app.post('/login', function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
      // var match = true;
      var match = bcrypt.compareSync(req.body.password, user.password);
      if(user === null){
        res.redirect('/#/signup');
      } 
      else if(!match){
        res.redirect('/#/login');
      }
      else {
        req.session.user = user.username;
        var data = JSON.stringify({user: user.username})
        res.redirect('/#/home');
      }
    });
  });

  app.get('/create_session', function(req, res){
    var data = JSON.stringify({user: req.session.user})
    res.end(data);
  })

  app.get('/api/authenticate', function(req, res){
    Language.findOne({name: req.session.language}).exec(function(err, data){
      if(data){
        var isAuthor = (data.createdBy === req.session.user);
        isAuthor = JSON.stringify(isAuthor);
        res.end(isAuthor);
      } else {
        res.end(JSON.stringify(false));
      }
    })
  })

  app.get('/api/home-data', function(req, res){
    Language.find({createdBy: req.session.user}, function(err, user_languages){
      if(err){ console.log(err) }
      Language.find().sort('-created_at').limit(5).exec(function(err, new_languages){
        if(err){ console.log(err) }
        Note.find({writtenBy: req.session.user}).limit(5).exec(function(err, notes){
          if(err){ console.log(err) }
          News.find({forUser: req.session.user}).exec(function(err, news){
            var data = JSON.stringify({user: user_languages, newLangs: new_languages, news: news});
            res.end(data);
          })
        })
      })
    });
  });

  app.get('/api/new-notes', function(req, res){
    Note.find({lang: req.session.language}).sort('-created_at').limit(10).exec(function(err, notes){
      notes = JSON.stringify(notes);
      res.end(notes);
    })
  })

  app.get('/api/get-language/:lang', function(req, res){
    var key = req.params.lang;
    Language.findOne({name: key}, function(err, data){
      req.session.language = data.name;
      req.session.langAuthor = data.createdBy;
      data = JSON.stringify(data);
      // console.log('getlang session', req.session);
      res.end(data);
    })
  });

  app.post('/api/new-language', function(req, res){
    new Language({createdBy: req.session.user, name: req.body.name}).save(function(err, data){
      req.session.language = data.name;
      res.redirect('/#/language/'+data.name);
    });
  });


  app.post('/api/new-word', checkLanguage, function(req, res){
    var word = req.body, classes;
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


  app.post('/api/new-class', checkLanguage, function(req, res){
    new Class({
      lang: req.session.language, 
      name: req.body.className, 
      explanation: req.body.explanation
    }).save(function(err, data){
      //data = JSON.stringify(data);
      res.redirect('/#/structures');
    });
  });

  app.get('/api/structure-data', checkLanguage, function(req, res){
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
  
  app.get('/api/word-data', checkLanguage, function(req, res){
    Word.find({lang: req.session.language}, function(err, data){
      if(err){ console.log(err); }
      data = JSON.stringify(data);
      res.end(data);
    });
  });

  app.get('/api/classes-data', checkLanguage, function(req, res){
    Class.find({lang: req.session.language}, function(err, data){
      console.log('error: ', err);
      data = JSON.stringify(data);
      res.end(data);
    });
  });

  app.get('/api/note-data', checkLanguage, function(req, res){
    Note.find({lang: req.session.language}, function(err, data){
      if(err){ console.log(err); }
      data = JSON.stringify(data);
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

  app.post('/api/new-structure', checkLanguage, function(req, res){
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

  app.post('/api/new-note', checkLanguage, function(req, res){
    var id = (req.body.id.length > 0) ? req.body.id : new mongoose.Types.ObjectId()
    Note.findByIdAndUpdate(id, {
      lang: req.session.language,
      content: req.body.content,
      meaning: req.body.meaning,
      writtenBy: req.session.user,
      merged: (req.session.langAuthor === req.session.user)
    }, {upsert: true}, function(err, data){
      if(err){ console.log(err); }
      var example = req.body.example;
      if(example !== ""){
        Word.findOneAndUpdate({lang: req.session.language, word: example}, {$push: {examples: id}}, function(err, word){
          if(err) { console.log(err) };
          res.redirect('/#/notes');
        })
      } else {
        if(req.session.langAuthor !== req.session.user){
          new News({
            forUser: req.session.langAuthor, 
            message: 'User '+req.session.user+' submitted a new note for language '+req.session.language+'.'
          }).save(function(err, news){
            if(err) { console.log(err); }
            res.redirect('/#/notes');
          })
        } else {
          res.redirect('/#/notes');
        }
      }
    })
  })

  app.get('/api/deleteNote/:id', function(req, res){
    var id = req.params.id;
    Note.findById(id, function(err, item){
      item.remove(function(err, data){
        if(err){ console.log(err); }

        if(item.writtenBy !== req.session.user){
          new News({
            forUser: item.writtenBy, 
            message: 'Your note: "'+item.content+'" was deleted by the language admin.'
          }).save(function(err, news){
            if(err) { console.log(err); }
            res.end();
          })
        }

        res.end();
      })
    })
  })

  app.get('/api/merge/:id', function(req, res){
    var id = req.params.id;
    Note.findByIdAndUpdate(id, {merged: true}, function(err, data){
      if(err) console.log(err);
      new News({
        forUser: data.writtenBy,
        message: 'Your note: "'+data.content+'" was merged in by the language admin.'
      }).save(function(err, news){
        if(err) console.log(err);  
        res.end();
      })
    })
  })

  app.get('/api/get-word/:id', function(req, res){
    var id = req.params.id;
    Word.findOne({_id: id}, function(err, data){
      if(err){ console.log(err); }
      console.log(data);
      data = JSON.stringify(data);
      res.end(data);
    })
  })

  app.get('/api/get-note/:id', function(req, res){
    var id = req.params.id;
    Note.findOne({_id: id}, function(err, data){
      if(err){ console.log(err); }
      data = JSON.stringify(data);
      res.end(data);
    })
  })

  app.get('/api/get-wordname/:name', function(req, res){
    var name = req.params.name;
    Word.findOne({word: name}, function(err, data){
      if(err){ console.log(err); }
      data = JSON.stringify(data);
      res.end(data);
    })
  })

  app.get('/api/delete-news/:id', function(req, res){
    var id = req.params.id;
    News.findById(id).remove(function(err){
      if(err) console.log(err);
      res.end();
    })
  })

  app.get('/api/delete-word/:id', function(req, res){
    var id = req.params.id;
    Word.findOne({_id: id}).remove(function(err){
      if(err){ console.log(err); }
      res.end();
    })
  })

app.listen(port);
//console.log('listening...');