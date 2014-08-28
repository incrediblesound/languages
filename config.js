require('./db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app, express){
  app.use(bodyParser());
  app.use(session({
    secret: 'alien badminton',
    resave: true,
    saveUninitialized: true
  }));
  app.engine('html', require('ejs').renderFile);
  app.use(express.static(__dirname));

  var apiRouter = express.Router();
  //var authRouter = express.Router();

  app.use('/api/', apiRouter);
  //app.use('/user/', authRouter);

  require('./api/routes.js')(apiRouter);
  //require('./api/auth.js')(authRouter);

  app.get('/', function(req, res){
    res.render('index.html');
  });

};