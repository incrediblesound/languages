var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app, express){
  app.use(bodyParser());
  app.use(session({
    secret: 'alien badminton',
    resave: true,
    saveUninitialized: true
  }));
  //app.engine('html', require('ejs').renderFile);
  app.use(express.static(__dirname+'/public'));

  require('./api/routes.js')(app);
};