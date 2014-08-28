var mongoose = require('mongoose');
var User = mongoose.model('user');

module.exports = function(app){
  app.post('/signup', function(req, res){
    console.log(req.body);
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      if(user){
        res.json(false);
      } else {
        new User({username: req.body.username, password: req.body.password}).save(function(err, newUser){
          console.log(newUser);
          req.session.user = user;
          res.json(true);
        });
      }
    });
  });

  app.post('/login', function(req, res){
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
      if(!user){
        res.end(false);
      } else {
        req.session.user = user;
        res.redirect('/#/home');
      }
    });
  });
};