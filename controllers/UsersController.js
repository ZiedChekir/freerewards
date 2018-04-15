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
const sgMail = require('@sendgrid/mail');
var zeroBounce = require('../config/zerobounce')



module.exports = {
    GET_register: function (req, res) {
        if (req.session.refferal) {
            console.log('refferal exists')
        }
        var url = req.query
        res.render('user/register', {
            username: url.username,
            name: url.name,
            email: url.email
        });
    },
    POST_register: async function (req, res, next) {
        sgMail.setApiKey('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');


        var name = req.body.name
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password;
        var password2 = req.body.password2;
        
        var validate = await zeroBounce.validate(email)

        
        
        //Error handling
        var Errors = validationResult(req)
        if (!Errors.isEmpty() || password != password2 || validate.status != 'Valid') {
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
            if(validate.status != 'Valid'){
                req.flash('error','Enter a Valid Email please')
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
            var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
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
            req.flash('info','Please confirm you Email:'+user.email+'before logging in')
             token = new ConfirmationToken({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
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
                text: 'hello '+name+', please confirm your email by clicking this url1: www.localhost:3111/confirm/'+token.token,
                html: '<strong>hello '+name+'</strong>, <p>please confirm your email by clicking this url: <a>www.localhost:3111/confirm/'+token.token+'</a></p>',
            };
            sgMail.send(msg);
            req.flash('success', 'Successfully registred. Please verify your email');
            res.redirect('/user/login');
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
            if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
                console.log('recapatcha wasnt checked')
                req.flash('error', 'Make sure to check recapatcha')
                return res.redirect(`/user/login?username=${username}`)

            }
            var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;


            request(verificationUrl, function (error, res, body) {

                var bodyParsed = JSON.parse(body)


                if (bodyParsed.success !== undefined && !bodyParsed.success) {

                    req.flash('error', 'something went wrong with recapatcha!')
                    return res.redirect(`/user/login?username=${username}`)

                }

                if (bodyParsed.success) {
                    req.flash('success', 'capatcher done')
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