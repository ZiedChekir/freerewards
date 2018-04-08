var moment = require('moment')
const request = require('request')
const {
    check,
    validationResult
} = require('express-validator/check')
//models && functions && operatins
const User = require('../models/users');

var shortid = require('shortid');

var forOwn = require('lodash.forown')


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
        // if (req.session.refferal) {
        //     //query for the user that reffered this new user           
        //     var refUser = await User.findOne({
        //         refferalUrl: req.session.refferal
        //     })         
            
        //     var obj =  {}
        //     obj.createdUserId = 0
        //     console.log(obj)
        //     refUser.refferedUsers = obj
            //add a reffrence in the refUser and assign 0 coins   
            // let obj = {}
            // obj[createdUserId] = 0 
            // console.log(obj) 
            // Object.assign(refUser.refferedUsers,obj)

            // refUser.refferedUsers = {...refUser.refferedUsers,`${a}`:0}
        //     refUser.save()          
        // }
        // return res.redirect('/user/register')

      
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
            console.log('inside the recp if')
            var recapatcha = req.body['g-recaptcha-response']
            if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {

                req.flash('error', 'Make sure to check recapatcha')
                return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)

            }
            var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

            console.log('before request')
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
        if (req.session.refferal) {
           let refUser= await User.findOne({refferalUrl:req.session.refferal})
           refBy = refUser._id
           
        }
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            coins: 0,
            joindate: getDate(),
            lastdailybonus: getPreviousDate(),
            profileimgurl: "http://res.cloudinary.com/dyy9ovwcv/image/upload/v1519766192/sw6calmlh1hjnqfbszch.png",
            refferedBy:refBy,
            refferalUrl:shortid.generate().toLowerCase()
        });

        //if Refferal exists in session
        var createdUserId
         User.createUser(newUser, async function (err, user) {
            if (err) {
                next(new Error("a problem has occured. Please register again"))
                req.flash('error', "a problem has occured. Please register again")
                return res.redirect('/user/register')
            }
            if (req.session.refferal) {
                //query for the user that reffered this new user           
                var refUser = await User.findOne({
                    refferalUrl: req.session.refferal
                })         
                //add a reffrence in the refUser and assign 0 coins   
                
                refUser.refferedUsers.push({id:user._id,username:user.username,coins:0})
                console.log(refUser.refferedUsers)
                refUser.save() 
                
                delete req.session.refferal             
            }
            req.flash('success', 'Successfully registred. Please verify your email');
            res.redirect('/user/login');
        })
           
            

      
        
        
        



    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////    LOGIN       ////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    GET_login: function (req, res) {
console.log('login' + req.session.refferal)
        res.render('user/login', {
            username: req.query.username
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