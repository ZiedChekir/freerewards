var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const ensureLoggedIn = require('../config/connect-ensure-login.1/lib/ensureLoggedIn')()
const ensureLoggedOut = require('../config/connect-ensure-login.1/lib/ensureLoggedOut')()
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
const crypto = require('crypto')
const debug = require('debug')('http')
  , http = require('http')
//DAta base connection


// mongoose.connect('mongodb://ziedchekir:ziedmessi!@ds151024.mlab.com:51024/freerewards');
//routing
router.get('/', function (req, res, next) {
  
  res.render('index');
})
router.get('/ref/:refferal',ensureLoggedOut,function(req,res,next){
  let refferal = req.params.refferal
  req.session.refferal = refferal
  res.redirect('/')
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


