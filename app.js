//Dependencies
const express          = require('express');
const path             = require('path');
const favicon          = require('serve-favicon');
const morgan           = require('morgan');
const cookieParser     = require('cookie-parser');
const bodyParser       = require('body-parser');
const expressHbs       = require('express-handlebars');
const mongoose         = require('mongoose');
const passport         = require('passport');
const session          = require('express-session');
const flash            = require('connect-flash');
const expressValidator = require('express-validator')
const compression      = require('compression')
const helmet           = require('helmet')
const mongodb          = require('mongodb')
const csrf             = require('csurf')
const redis            = require("redis");
const referrerPolicy   = require('referrer-policy')
const csp              = require('helmet-csp')
const redisStore       = require('connect-redis')(session)
const moment           = require('moment')

// --------------Models ------------------
const Users            = require('./models/users')
// --------------ROUTES--------------------
const index            = require('./routes/index');
const user             = require('./routes/user');
const prizes           = require('./routes/prizes');
const earncoins        = require('./routes/earncoins');
const profile          = require('./routes/profile');

var RateLimit = require('express-rate-limit');
 
// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
 

 
//  apply to all requests

// var mongodburl = process.env.MONGODB_URI ||"mongodb://{$process.env.DB_USER}:{$process.env.DB_PASS}@ds151024.mlab.com:51024/freerewards"

// var hbs = expressHbs.create({
//   // Specify helpers which are only registered on this instance.
//   helpers: {
//       foo: function () { return 'FOO!'; },
//       bar: function () { return 'BAR!'; }
//   }
// });

//initialization
require('dotenv').config()
var mongodburl = process.env.mongodb || 'mongodb://localhost:27017/freereward'
var MongoClient        = require('mongodb').MongoClient;
var client  = redis.createClient();
var csrfProtection = csrf({ cookie: true })

const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

var limiter = new RateLimit({
  windowMs:5*60*1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 ,// disable delaying - full speed until the max limit is reached
  message: "Too many requests"
});
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
//app.use(favicon(path.join(__dirname, 'public', 'favicon_nwg_icon.ico')));


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(compression())

var Hours = 3600000 * 5
app.use(
  session({
    secret: process.env.sessionSecret,
    store:new redisStore({host:'localhost',port:6379,client: client}),
    //,client: client,ttl :  260
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires : new Date(Date.now() + Hours),
      maxAge : Hours
    }
  })
);


app.use(expressValidator({
  customValidators:{
    isEqaul:function(value,value2){
      return value == value2
    },
    hasNumAndChar:function(value){
      var regex =  /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
			return regex.test(value);
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
app.enable('trust proxy')
app.use(csrfProtection)
//------------Global VARIABLES-------------------------
app.use(function (req, res, next) {
//console.log(req.headers['x-forwarded-for'])
//console.log(req.ip)  


res.locals.success= req.flash('success');
  res.locals.errors = req.flash('error');

  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken()
  if (req.user) {
    
    res.locals.logged = true;

    res.locals.getDaily = false
    
    let now = moment(moment().format('DD/MM/YYYY hh:mm'), 'DD/MM/YYYY hh:mm')
    let last = moment(moment(req.user.lastdailybonus, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY hh:mm'), 'DD/MM/YYYY hh:mm')
    if (moment.duration(now.diff(last)).asHours() >= 24) {
      res.locals.getDaily =true
    }

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
    
      // let refUserCoins = 0; 
      // for(let i = 0; i < req.user.refferedUsers.length;i ++){
      //   refUserCoins += req.user.refferedUsers[i].coins        
      // }
      
      res.locals.usercoins = Math.floor(req.user.totalCoins)
     
  } else {
    res.locals.logged = false;
  }

 


  next();

});
app.use(limiter);


//----------------SET ROUTES----------------

app.use('/', index);
app.use('/user' ,user);
app.use('/prizes', prizes);
app.use('/earncoins', earncoins);

app.use('/profile', profile);




// catch 404 and forward to error handler
app.use(function (error,req, res, next) {
  var err = new Error(error);
  console.log(err.stack)
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