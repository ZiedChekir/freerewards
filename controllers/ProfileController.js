var mongoose = require('mongoose');
var fs = require('fs')
var multer = require('multer')
var request = require('request')
var cloudinary = require('cloudinary');

var User = require('../models/users');

var Orders = require('../models/orders')

var maxSize = 1000000;
var upload = multer({
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
    dest: 'uploads/',
    limits: {
        fileSize: maxSize
    }
}).single('image')




cloudinary.config({
    cloud_name: 'dyy9ovwcv',
    api_key: '333274761868348',
    api_secret: 'bFypPblXA-7gKJl5OWO_UE-2fAk'
});









module.exports = {
    GET_overview: async function (req, res, next) {
 
        let orders = await Orders.find({
            email: res.locals.user.email
        })
        let user = await User.findOne({
            _id: res.locals.user._id
        })

        res.render('profile/overview', {
            helpers: {
                floorCoins: function (coins) {
                    return Math.floor(coins)
                }
            },

            refferedUsers: user.refferedUsers
        })

    },
    GET_orders: async function (req, res, next) {
        // let user = await User.findOne({_id: res.locals.user._id})
        let orders = await Orders.find({
            email: res.locals.user.email
        })
        res.render('profile/orders', {
            orders: orders
        })
    },
    GET_settings: async function (req, res, next) {
        res.render('profile/settings')
    },
    POST_file: function (req, res, next) {
        upload(req, res, function (err) {
            if (err) {
                console.log(err)
                req.flash('error', 'An error occurred when uploading.The image must be below 1MB and with  .jpg or .jpeg or .png extension ')
                return res.redirect('/profile/settings')
            } else {
                next()
            }
        }) //check for errors if there was a picture uploaded
    },
    POST_update: async function (req, res, next) {

        var errors = []

        // req.checkBody('email', 'invalid email').isEmail()
        var username = req.body.editusername
        var email = req.body.editemail
        var newpassword = req.body.editpassword
        var passcofirm = req.body.pass

        //check files
        if (req.file) {
            cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
                if (err) {
                    req.flash('error', 'failed to upload the image.Please try again or contact us')
                }
                User.findOneAndUpdate({
                    _id: res.locals.user._id
                }, {
                    profileimgurl: result.secure_url
                }, function (err) {
                    if (err) {
                        req.flash('error', 'failed to upload the image')

                    } else {
                        req.flash('success', 'new picture takes few seconds to load !')
                        fs.unlink('./uploads/' + result.original_filename)
                    }
                })

            })
        }

        //if any of the fields was updated + the confirm pass
        if ((username || email || newpassword) && passcofirm) {
            //check input
            if (username) {
                req.check('editusername', 'username length must be between 6 and 20 characters including numbers').len({
                    min: 6,
                    max: 20
                }).hasNumAndChar()
                var user = await User.find({
                    username: username
                })
                if (!(user.length == 0)) {
                    errors.push('username already in use')
                }
            }
            if (email) {
                req.checkBody('editemail', 'invalid email').isEmail()
                var user = await User.find({
                    email: email
                })
                if (!(user.length == 0)) {
                    errors.push('email already in use')
                }

            }
            if (newpassword) {
                req.checkBody('editpassword', 'new password length must be between 8 and 20 characters including numbers').len({
                    min: 8,
                    max: 20
                }).hasNumAndChar()
            }

            if (req.validationErrors() || (errors.length > 0)) {
                if (req.validationErrors()) {
                    req.validationErrors().map(function (x) {
                        errors.push(x.msg)
                    })
                }
                req.flash('error', errors)
                return res.redirect(`/profile/settings`)
            }
            try {
                //capatcher
                if (process.env.NODE_ENV == 'production') {
                    var recapatcha = req.body['g-recaptcha-response']
                    if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {

                        req.flash('error', 'Make sure to check recapatcha')
                        return res.redirect(`/profile/settings`)
                    }
                    var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
                    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

                    console.log('before request')
                    request(verificationUrl, function (error, res, body) {
                        console.log('inside request')
                        var bodyParsed = JSON.parse(body)
                        if (bodyParsed.success !== undefined && !bodyParsed.success) {
                            console.log('success is false')
                            req.flash('error', 'something went wrong with recapatcha!')
                            return res.redirect(`/profile/settings`)

                        }
                        if (bodyParsed.success) {
                            req.flash('success', 'capatcher done')

                        }
                    })
                }
                //Updating the user
                var user = await User.findOne({
                    _id: res.locals.user._id
                })
                User.comparePassword(passcofirm, user.password, async function (err, isMatch) {
                    if (err) next(err);
                    if (isMatch) {
                        if (username) {
                            user.username = username
                            await user.save()
                        }
                        if (email) {
                            user.email = email
                            await user.save()
                        }
                        if (newpassword) {
                            User.hashandsave(user, newpassword, function (err) {
                                if (err) next(new Error(err));
                            })
                        }
                        req.flash('success', "account successfully updated")
                    } else { //old password is wrong						
                        req.flash('error', "Current password is wrong")
                    }
                    res.redirect('/profile/settings')
                })
            } catch (err) {
                next(new Error(err))
            }
        } else {
            res.redirect('/profile/settings') //input was not touched
        }
    }

}