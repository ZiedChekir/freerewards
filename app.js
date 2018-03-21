//Dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator')
const compression = require('compression')
const helmet = require('helmet')
const mongodb = require('mongodb')
const csrf = require('csurf')
const loggerr = require('./config/logger').debug
var  referrerPolicy = require('referrer-policy')
var csp = require('helmet-csp')


var csrfProtection = csrf({ cookie: true })
// --------------ROUTES--------------------

const index = require('./routes/index');
const user = require('./routes/user');
const prizes = require('./routes/prizes');
const earncoins = require('./routes/earncoins');
const invite = require('./routes/invite');
const profile = require('./routes/profile');

// var mongodburl = process.env.MONGODB_URI ||"mongodb://{$process.env.DB_USER}:{$process.env.DB_PASS}@ds151024.mlab.com:51024/freerewards"
var mongodburl = "mongodb://zied:zied1478963!@ds151024.mlab.com:51024/freerewards"

const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect(mongodburl,options);

//-----------------BEGIN-----------------
var app = express();
app.use(helmet());
app.use(referrerPolicy({ policy: 'no-referrer' }))
// app.use(csp({
//   directives: {
//     defaultSrc: ["'self'"],
//     styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com','fonts.googleapis.com','https://fonts.gstatic.com/s/quicksand/v7/6xKtdSZaM9iE8KbpRA_hJFQNcOM.woff2','https://use.fontawesome.com/c3b6c7d70e.css'],
//     scriptSrc: ["'self'",'use.fontawesome.com','unpkg.com','google.com','unpkg.com','https://cdn.fontawesome.com/js/stats.js','https://use.fontawesome.com/c3b6c7d70e.css'],
   
//     fontSrc:["'self'",'https://fonts.gstatic.com/s/quicksand/v7/6xKtdSZaM9iE8KbpRA_hJFQNcOM.woff2']
//   }
// }))

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(compression())


app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: false,
    saveUninitialized: false
    // cookie: {
    //   httpOnly: true,
    //   secure: true
    // }
  })
);


app.use(expressValidator({
  customValidators: {
    isEqual: (value1, value2) => {
      return value1 === value2
    }
  },
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(csrfProtection)
//------------Global VARIABLES-------------------------
app.use(function (req, res, next) {
  
   res.locals.success= req.flash('success');
  res.locals.errors = req.flash('errors');

  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken()
  if (req.user) {


    res.locals.logged = true;
    res.locals.user =
      {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        coins: req.user.coins,
        joindate: req.user.joindate,
        lastdailybonus: req.user.lastdailybonus,
        __v: req.user.__v,
        completedMissions: req.user.completedMissions,
        orders: req.user.orders,
        profileimgurl:req.user.profileimgurl
      }
    res.locals.usercoins = req.user.coins;
  } else {
    res.locals.logged = false;
  }
  next();

});


//----------------SET ROUTES----------------
app.use('/', index);
app.use('/user', user);
app.use('/prizes', prizes);
app.use('/earncoins', earncoins);
app.use('/invite', invite);
app.use('/profile', profile);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  if(err.code === 'LIMIT_FILE_SIZE'){res.redirect('/erorooorroro')}
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
