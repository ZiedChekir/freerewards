//Dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
var flash = require('connect-flash');
var expressValidator = require('express-validator')
var coinsModel = require('./functionManagement/coins');
var compression = require('compression')
var helmet = require('helmet')
var debug = require('debug')('http')
var mongodb = require('mongodb')
// --------------ROUTES--------------------

const index = require('./routes/index');
const user = require('./routes/user');
const prizes = require('./routes/prizes');
const earncoins = require('./routes/earncoins');
const invite = require('./routes/invite');
const profile = require('./routes/profile');

var mongodburl = process.env.MONGODB_URI ||"mongodb://ziedchekir:ziedmessi!@ds151024.mlab.com:51024/freerewards"

mongoose.connect(mongodburl);

//-----------------BEGIN-----------------
var app = express();
app.use(helmet());







// mongoose.connect(uri, { useMongoClient: true }).then(() => console.log('connected to DB'))
// .catch(err => console.log(err));


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');
var coinsInstance = new coinsModel();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())


app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: false,
    saveUninitialized: false
  })
  );
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//------------Global VARIABLES-------------------------
app.use(function(req, res, next) {

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  
  if (req.user) {
    res.locals.logged = true;
    res.locals.user = req.user;
    res.locals.usercoins = coinsInstance.decryptcoins(req.user.coins)
    
  }else{
    res.locals.logged = false;
  }
  next();

});


//----------------SET ROUTES----------------
app.use('/', index);
app.use('/user', user);
app.use('/prizes', prizes);
app.use('/earncoins',earncoins);//
app.use('/invite',invite);
app.use('/profile',profile);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
