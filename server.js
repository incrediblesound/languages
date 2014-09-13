require('./db.js');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
  app.use(session({
    secret: 'alien badminton',
    resave: true,
    saveUninitialized: true
  }));
  //app.engine('html', require('ejs').renderFile);
  app.use(express.static(__dirname+'/public'));

module.exports = require('./api/routes.js')(app);

//require('./config.js')(app, express);

//module.exports = app;