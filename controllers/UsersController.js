var moment = require('moment')
const request = require('request')
const {
    check,
    validationResult
} = require('express-validator/check')
//models && functions && operatins
const User = require('../models/users');
const ConfirmationToken = require('../models/confirmationToken')
var shortid = require('shortid');

var forOwn = require('lodash.forown')
const crypto = require('crypto')
var zeroBounce = require('../config/zerobounce')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.sendgridKey);

module.exports = {
    GET_register: function (req, res) {
        var url = req.query
        res.render('user/register', {
            username: url.username,
            name: url.name,
            email: url.email
        });
    },
    POST_register: async function (req, res, next) {
    


        var name = req.body.name
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password;
        var password2 = req.body.password2;
        
        

        
        
        //Error handling
        var Errors = validationResult(req)
    if (!Errors.isEmpty() || password != password2) {
            if (password != password2) {
                req.flash('error', 'Passwords don\'t match')
            }
            if (!Errors.isEmpty()) {
                var errors = []
                forOwn(Errors.mapped(), function (value, key) {
                    errors.push(value.msg)
                })
                req.flash('error', errors)
            }
           
            return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)
        }

        //capatcher
        if (process.env.NODE_ENV == 'production') {

            var recapatcha = req.body['g-recaptcha-response']
            if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {

                req.flash('error', 'Make sure to check recapatcha')
                return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)

            }
            var secretKey = process.env.recapatcha
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
            request(verificationUrl, function (error, res, body) {
                var bodyParsed = JSON.parse(body)
                if (bodyParsed.success !== undefined && !bodyParsed.success) {
                    console.log('success is false')
                    req.flash('error', 'something went wrong with recapatcha!')
                    return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)

                } else { //capatcher is done
                }
            })
        }
        var refBy = null
        var initizialCoins = 0
        if (req.session.refferal) {
            let refUser = await User.findOne({
                refferalUrl: req.session.refferal
            })
            refBy = refUser._id
            initizialCoins = 200
        }
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            coins: initizialCoins,
            joindate: getDate(),
            lastdailybonus: getPreviousDate(),
            profileimgurl: "http://res.cloudinary.com/dyy9ovwcv/image/upload/v1519766192/sw6calmlh1hjnqfbszch.png",
            refferedBy: refBy,
            refferalUrl: shortid.generate().toLowerCase(),
            emailVerified: false
        });

        //if Refferal exists in session
        var createdUserId
        var token
        User.createUser(newUser, async function (err, user) {
            if (err) {
                next(new Error(err))
                req.flash('error', "a problem has occured. Please register again")
                return res.redirect('/user/register')
            }
            req.session.userId = user._id
            req.session.userEmail = user.email
            req.flash('info','Please confirm you Email: '+user.email+' before logging in')
             token = new ConfirmationToken({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex'),
                createdAt:Date.now()
            })
            token.save();
            if (req.session.refferal) {
                //query for the user that reffered this new user           
                var refUser = await User.findOne({
                    refferalUrl: req.session.refferal
                })
                //add a reffrence in the refUser and assign 0 coins             
                refUser.refferedUsers.push({
                    id: user._id,
                    username: user.username,
                    coins: 0
                })
                refUser.save()
                delete req.session.refferal
            }
            
       
            const msg = {
                to: email,
                from: 'noreply@freerewards.com',
                subject: 'Freerewards Email Confirmation 1',
                text: 'hello '+name+', please confirm your email by clicking this url1: '+req.hostname+'/confirm/'+token.token,
                html: '<strong>hello '+name+'</strong>, <p>please confirm your email by clicking this url: '+req.hostname+'/confirm/'+token.token+'</p>',
            };
            sgMail.send(msg);
            req.flash('success', 'Successfully registred. Please verify your email');
            res.redirect('/verify');
        })       
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////    LOGIN       ////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    GET_login: function (req, res) {
        var info = req.flash('info')
        
        res.render('user/login', {
            username: req.query.username,
            infoFlash:info
        });

    },
    capatcherCheck: async function (req, res, next) {
        //capatcher
        if (process.env.NODE_ENV == 'production') {
            
            
            var recapatcha = req.body['g-recaptcha-response']
            console.log(req.body)
            
            
            var secretKey = process.env.recapatcha

            if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
                var username = req.body.username
                console.log('recapatcha wasnt checked')
                req.flash('error', 'Make sure to check recapatcha')
                return res.redirect(`/user/login?username=${username}`)

            }
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;


            request(verificationUrl, function (error, res, body) {

                var bodyParsed = JSON.parse(body)


                if (bodyParsed.success !== undefined && !bodyParsed.success) {
                    var username = req.body.username
                    req.flash('error', 'something went wrong with recapatcha!')
                    return res.redirect(`/user/login?username=${username}`)

                }

                if (bodyParsed.success) {
                    
                    next()
                }
            })
        } else {
            next() //login needs a next()
        }

    },


    // POST_login:,


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////  LOGOUT       ////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    GET_logout: function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');

    }
}





function getDate() {
    return moment().format('DD/MM/YYYY HH:mm')
}

function getPreviousDate() {
    return moment().subtract(1, 'days').format('DD/MM/YYYY HH:mm')
}