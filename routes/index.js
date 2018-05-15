

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const ensureLoggedIn = require('../config/connect-ensure-login.1/lib/ensureLoggedIn')()
const ensureLoggedOut = require('../config/connect-ensure-login.1/lib/ensureLoggedOut')()
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
const crypto = require('crypto')
const debug = require('debug')('http'),
  http = require('http')
const EmailToken = require('../models/confirmationToken')
const PassToken = require('../models/passwordResetToken')
const request = require('request')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.sendgridKey);
//DAta base connection

// mongoose.connect('mongodb://ziedchekir:ziedmessi!@ds151024.mlab.com:51024/freerewards');
//routing


router.get('/', function (req, res, next) {
  console.log(req.rateLimit)
  res.render('index');
})
router.get('/verify', function (req, res, next) {
  var userEmail = req.session.userEmail
  if(userEmail)
    res.render('verifyEmail',{userEmail:userEmail});
  else
    res.redirect('/')
  })
router.get('/confirm/:token', function (req, res, next) {
  EmailToken.findOne({
    token: req.params.token
  }, function (err, token) {
    if (err) return next(err)
    if (!token) {
      req.flash('error', "unable to find token")
    } else {
      User.findOne({
        _id: token._userId
      }, function (err, user) {
        if (err) return next(err)
        if (user) {
          user.emailVerified = true
          user.save(function (err, result) {
            if (err) next(err)
            token.remove()
            delete req.session.userId
            delete req.session.userEmail
            req.flash('success', 'email verified')
            res.redirect('/')
          })
          
        }
      })
    }
  })

})
router.get('/ref/:refferal', ensureLoggedOut, function (req, res, next) {
  let refferal = req.params.refferal
  req.session.refferal = refferal
  res.redirect('/')
})
router.get('/resendToken', ensureLoggedOut, function (req, res, next) {
  var userid = req.session.userId
  var email = req.session.userEmail
  User.findOne({_id: userid}, function (err, user) {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'user with the specified email is not found. Please Register!')
      return res.redirect('/user/register')
    }
    EmailToken.findOne({
      _userId: userid
    }, function (err, token) {
      if (err) return next(err)
      var tokenToSendInstance
      if (!token) {
        var newToken = new EmailToken({
          createdAt: Date.now(),
          _userId: userid,
          token: crypto.randomBytes(16).toString('hex')
        })
        tokenToSendInstance = newToken
        newToken.save()
      } else {
        tokenToSendInstance = token
      }
      console.log(tokenToSendInstance)
      const msg = {
        to: email,
        from: 'noreply@freerewards.com',
        subject: 'Freerewards Email Reconfirmation',
        text: 'hello ' + user.name + ', please confirm your email by clicking this url1: '+req.hostname+'/confirm/' + tokenToSendInstance.token,
        html: '<strong>hello ' + user.name + '</strong>, <p>please confirm your email by clicking this url: <a>'+req.hostname+'/confirm/' + tokenToSendInstance.token + '</a> ' + new Date() + '</p>',
      };
      
      sgMail.send(msg);
      req.flash('success','Email verification was sent!')
      res.redirect('/user/login')
    })
  })
  /*
   get Token with this userid then populate userid to get the user data 
   then get the email and send the fucking email again
  */
})

router.get('/password/reset', function (req, res, next) {
  res.render('user/passEmailConf')
})
router.post('/password/reset', function (req, res, next) {



  var email = req.body.email

  req.checkBody('email', 'enter a valid Email').isEmail()
  if (req.validationErrors()) {

  }
  User.findOne({
    email: email
  }, function (err, user) {
    if (err) return next(err)
    if (!user) {
      console.log('user is not found')
      req.flash('error', 'user is not Found. Please Register')
      return res.redirect('/')
    } else {
      console.log('user found')
      //needs to check if there is a Reset pass token already 
      var token = ""
      PassToken.findOne({
        _userId: user._id
      }, async function (err, tokenExists) {
        if (err) return next(err)

        if (tokenExists) {
          console.log('token already exists')
          token = tokenExists.token
        } else {
          console.log('token is not found. so new token is created')
          var newToken = new PassToken({
            createdAt: Date.now(),
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
          })

         var t = await newToken.save().catch(function(err){
            next(err)
          })
          token = t.token
        }
        

        const msg = {
          to: email,
          from: 'noreply@freerewards.com',
          subject: 'Freerewards Email Reconfirmation',
          text: 'hello ' + user.name + ', please confirm your email by clicking this url1: '+req.hostname+'/confirm/' + token,
          html: '<strong>hello ' + user.name + '</strong>, <p>please confirm your email by clicking this url: <a>'+req.hostname+'/password/reset/' + token + '</a> ' + new Date() + '</p>',
        };
        sgMail.send(msg);
        req.flash('success', 'check you email to Reset your password')
        res.redirect('/')
      })
    }
  })
})

router.get('/password/reset/:token', function (req, res, next) {
  var token = req.params.token
  PassToken.findOne({
    token: token
  }, function (err, result) {
    if (err) return next(err)
    if (!result) {
      req.flash('error', 'something went wrong. Please try later')
      return res.redirect('/')
    } else {
      res.render('user/passwordReset', {
        token: token
      })
    }
  })
})

router.post('/password/reset/:token', function (req, res, next) {
  var token = req.params.token
  var password = req.body.password
  PassToken.findOne({
    token: token
  }, function (err, result) {
    if (err) return next(err)

    if (!result) {
      req.flash('error', 'something went wrong. Please try later')
      return res.redirect('/')
    } else {
      User.findOne({
        _id: result._userId
      }, function (err, user) {
        console.log(user)
        if (err) return next(err)
        if (!user) {
          req.flash('error', 'something went wrong. Please try later')
          return res.redirect('/')
        } else {
          User.hashandsave(user, password, function (err) {
            if (err) return next(err);
            req.flash('success', 'Password successfully updated')
            res.redirect('/user/login')
          })
        }
      })

    }
  })
})
router.get('/gene', function (req, res, next) {
  Users.findOne({id:_id},function(reqq,rs){
    console.log(reqq)
  })
  res.redirect('/')
})
router.get('/genera', function (req, res, next) {
  var newToken = new PassToken({
    _userId: "5ac916b3fb365142b82db8da",
    token: "hezheqsd"
  })
  newToken.save()
  res.redirect('/')
})

router.get('/kiwi', async function (req, res, next) {
  console.log(req.query)
  // `new` is a reserved keyword, so we can't use `new` as a variable name.
  // request('https://www.kiwiwall.com/get-offers/yMbaU60CmbPDALblYkVTZ4vmm7Skp9QN/?country=TN',function(err,resp,body){
  //   if(err) console.log(err)
  //   console.log(body)
  // })
  // const {
  //   id,
  //   uid,
  //   oid,
  //   total,
  //   sig
  // } = req.query
  res.status(200)
  res.send()
  // Empty Object ...

  //so this obviously throws error..
  // const secretHash = crypto.createHash('md5').update('8335728bcaf48908975f99e44b4d2840').digest('hex')
  // if (secretHash !== sig) {
  //   throw new Error('Invalid transaction')
  // }else{
  // 	console.log('success')
  // }

})


module.exports = router;