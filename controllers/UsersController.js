var moment = require('moment')

//models && functions && operatins
const User = require('../models/users');
const Coins = require('../Operations/encryptCoins');
const userOperation = require('../Operations/userOperations')

const request = require('request')





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
        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;

        // Validation
        req.checkBody('name', 'invalid name').notEmpty().len({
            min: 6,
            max: 20
        })
        req.checkBody('email', 'invalid email').notEmpty().isEmail()
        req.checkBody('username', 'invalid username').notEmpty().len({
            min: 6,
            max: 20
        })
        req.checkBody('password', 'invalid password').notEmpty().len({
            min: 8,
            max: 20
        })
        req.checkBody('password2', 'passwords don\'t match').isEqual(password)

        //Error handling
console.log(password)
console.log(password2)
if(password == password2)
{
    console.log('passwords are the same')
}
        var valErrors = req.validationErrors()
        if (valErrors) {
            var errors = []
            valErrors.map(function (x) {
                errors.push(x.msg)
            })
            req.flash('errors', errors)

            return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)

        }
 
       
            if (process.env.NODE_ENV == 'production') {
                console.log('inside the recp if')
                var recapatcha = req.body['g-recaptcha-response']
                if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
                    
                    req.flash('errors', 'Make sure to check recapatcha')
                    return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)
            
                }
                var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
                var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
            
                console.log('before request')
                request(verificationUrl, function (error, res, body) {
                    console.log('inside request')
                    if (body.success !== undefined && !body.success) {
                        console.log('success is false')
                        req.flash('errors', 'something went wrong with recapatcha!')
                        return res.redirect(`/user/register?name=${name}&username=${username}&email=${email}`)
            
                    }
                  
                        req.flash('success', 'capatcher done')
                        
                    
            
                })
            } 
            else {
                next()
            }
        
        try {
            var emailExist = await userOperation.queryByEmail(email)
            var usernameExist = await userOperation.queryByUsername(username)

        } catch (err) {
            next(err)
        }
        if (emailExist) {
            req.flash('errors', "email already in use")
            return res.redirect('/user/register')
        }
        if (usernameExist) {
            req.flash('errors', "username already in use")
            return res.redirect('/user/register')

        }
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            coins: 0,
            joindate: getDate(),
            lastdailybonus: getPreviousDate(),
            profileimgurl: "http://res.cloudinary.com/dyy9ovwcv/image/upload/v1519766192/sw6calmlh1hjnqfbszch.png"
        });

        User.createUser(newUser, function (err, user) {
            if (err) {
                next(err)
                req.flash('errors', "a problem has occured. Please register again")
                return res.redirect('/user/register')

            }
        });
        req.flash('success', 'You are registered and can now login');
        res.redirect('/user/login');

    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////    LOGIN       ////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    GET_login: function (req, res) {

        res.render('user/login');
    },
    POST_login: async function (req, res, next) {
        req.checkBody('username', 'username at least 6 characters').notEmpty().len({min:6})
        req.checkBody('password', 'password at least 8 characters').notEmpty()
        var username = req.body.username
        var valErrors = req.validationErrors()
        if (valErrors) {
            var errors = []
            valErrors.map(function (error) {
                errors.push(error.msg)
            })
            console.log(errors)
            req.flash('errors', errors)
            return res.redirect(`/user/login?username=${username}`)

        }
        if (process.env.NODE_ENV == 'production') {
            var recapatcha = req.body['g-recaptcha-response']
            if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
                console.log('recapatcha wasnt checked')
                req.flash('errors', 'Make sure to check recapatcha')
                return res.redirect(`/user/login?username=${username}`)
        
            }
            var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        
            console.log('before request')
            request(verificationUrl, function (error, res, body) {
                console.log(JSON.parse(body))
                if (body.success !== undefined && !body.success) {
                    console.log('success is false')
                    req.flash('errors', 'something went wrong with recapatcha!')
                    return res.redirect(`/user/login?username=${username}`)
        
                }
                console.log(body['success'])
                if(body.success){
                    req.flash('success', 'capatcher done')
                    console.log(body)
                    
                }
                next()
              
                    
                   
                    
                
        
            })
        } else {
            next()
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