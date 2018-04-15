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

const sgMail = require('@sendgrid/mail');
//DAta base connection

// mongoose.connect('mongodb://ziedchekir:ziedmessi!@ds151024.mlab.com:51024/freerewards');
//routing


router.get('/', function (req, res, next) {
  var token = new EmailToken({
    _userId: "5ac917382b1c3858d4b3ece1",
    token: "123SDAZDQSD"
  })
  token.save()
  res.render('index');
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
            req.flash('success', 'email verified')

          })
          res.redirect('/')
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
 console.log(userid)
 console.log(email)


  User.findOne({_id: userid }, function (err, user) {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'user with the specified email is not found. Please Register!')
      return res.redirect('/user/register')
    }
    EmailToken.findOne({ _userId: userid}, function (err, token) {
      if (err) return next(err)
      var tokenToSendInstance
      if (!token) {
        var newToken = new EmailToken({
          _userId: userid,
          token: crypto.randomBytes(16).toString('hex')
        })
        tokenToSendInstance = newToken
        newToken.save()
      } else {
        tokenToSendInstance = token
      }
      sgMail.setApiKey('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');
      const msg = {
        to: email,
        from: 'noreply@freerewards.com',
        subject: 'Freerewards Email Reconfirmation',
        text: 'hello ' + user.name + ', please confirm your email by clicking this url1: www.localhost:3111/confirm/' + tokenToSendInstance.token,
        html: '<strong>hello ' + user.name + '</strong>, <p>please confirm your email by clicking this url: <a>www.localhost:3111/confirm/' + tokenToSendInstance.token + '</a> '+new Date()+'</p>',
      };
      sgMail.send(msg);
      res.redirect('/user/login')
    })
  })
  /*
   get Token with this userid then populate userid to get the user data 
   then get the email and send the fucking email again
  */
})

router.get('/password/reset',function(req,res,next){
  res.render('user/passEmailConf')
})
router.post('/password/reset',function(req,res,next){
 

  
  var email = req.body.email

  req.checkBody('email','enter a valid Email').isEmail()
  if(req.validationErrors()){

  }
  User.findOne({email:email},function(err,user){
    if(err) return next(err)
    if(!user){
      console.log('user is not found')
      req.flash('error','user is not Found. Please Register')
      return res.redirect('/')
    }else{
      console.log('user found')
      //needs to check if there is a Reset pass token already 
      var token = ""
      PassToken.findOne({_userId:user._id},function(err,tokenExists){
        if(err) return next(err)
        
        if(tokenExists){
          console.log('token already exists')
          token = tokenExists.token
        }else{
          console.log('token is not found. so new token is created')
          var newToken =  new PassToken({_userId:user._id,token:crypto.randomBytes(16).toString('hex')})
          newToken.save(function(err,result){
            if(err) console.log(err)
            console.log(result + "  token registred")
            token = newToken.token
          })        
        }
        
        sgMail.setApiKey('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');
        const msg = {
          to: email,
          from: 'noreply@freerewards.com',
          subject: 'Freerewards Email Reconfirmation',
          text: 'hello ' + user.name + ', please confirm your email by clicking this url1: www.localhost:3111/confirm/' + token,
          html: '<strong>hello ' + user.name + '</strong>, <p>please confirm your email by clicking this url: <a>www.localhost:3111/confirm/' +token + '</a> '+new Date()+'</p>',
        };
        sgMail.send(msg);
      req.flash('success','check you email to Reset your password')
      res.redirect('/')
      })  
    }
  })
})

router.get('/password/reset/:token',function(req,res,next){
  var token = req.params.token
  PassToken.findOne({token:token},function(err,result){
    if(err) return next(err)
    if(!result){
      req.flash('error','something went wrong. Please try later')
      return res.redirect('/')
    }else{
      res.render('user/passwordReset',{token:token})
    }
  })
})

router.post('/password/reset/:token',function(req,res,next){
  var token = req.params.token
  var password = req.body.password
  PassToken.findOne({token:token},function(err,result){
    if(err) return next(err)
    
    if(!result){
      req.flash('error','something went wrong. Please try later')
      return res.redirect('/')
    }else{
      User.findOne({_id:result._userId},function(err,user){
        console.log(user)
        if(err) return next(err)
         if(!user){
         req.flash('error','something went wrong. Please try later')
         return res.redirect('/')
        }else{
          User.hashandsave(user, password, function (err) {
            if (err) return next(err);
            req.flash('success','Password successfully updated')
            res.redirect('/user/login')
        })
        }
      })

    }
  })
})

// router.post('/checkcoins', async function (req, res, next) {
//   // `new` is a reserved keyword, so we can't use `new` as a variable name.



//   const newCurrency = req.query['new']

//   const {
//     id,
//     uid,
//     oid,
//     total,
//     sig
//   } = req.query
//   console.log(req.query)
//   res.send(req.query)
//   // Empty Object ...

//   //so this obviously throws error..
//   // const secretHash = crypto.createHash('md5').update('8335728bcaf48908975f99e44b4d2840').digest('hex')
//   // if (secretHash !== sig) {
//   //   throw new Error('Invalid transaction')
//   // }else{
//   // 	console.log('success')
//   // }

// })
module.exports = router;

