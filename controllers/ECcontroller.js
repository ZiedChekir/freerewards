//Models && Operations
var Users = require('../models/users')
var Videos = require('../models/videos')
var Missions = require('../models/missions')
var Coupons = require('../models/couponsData')
const moment = require('moment')

var cc = require('coupon-code');
var Videos = require('../models/videos')


const videoCoins = 5;
const dailyCoins = 2;
module.exports = {
    GET_offerwall: async function (req, res, next) {
        try {
            let missionsArray = await Missions.find()
            let user = await Users.findOne({
                _id: res.locals.user._id
            })
            var missions = []
            //no mission is completed yet  for this user
            if (user.completedMissions.length == 0) {
                missions = missionsArray
            } else {
                missions = missionsArray.filter(function (mission) {
                    for (let i = 0; i < user.completedMissions.length; i++) {
                        if (mission.title == user.completedMissions[i]) {
                            return false
                        }
                    }
                    return mission
                })
            }

            res.render('earncoins/offerwall', {
                missionsToDisplay: missions
            })
        } catch (err) {
            next(err)
        }
    },
    POST_offerwall_mission_id: async function (req, res) {
        let id = req.params.id
        let missionToPush
        let missionCoins = 0;
        try {
            let mission = await Missions.findOne({
                id: id
            })

            let user = await Users.findOne({
                _id: res.locals.user._id
            })
            user.completedMissions.map(function (x) {
                if (x == mission.title) {
                    return res.redirect('/earncoins/offerwall')
                }
            })
            user.completedMissions.push(mission.title);
            user.coins += mission.coins;
            await user.save()
            res.redirect('/earncoins/offerwall')
        } catch (err) {
            next(err)

        }
    },

    /////////////// DAILY BONUS /////////////////////
    GET_daily: function (req, res, next) {
        res.render('earncoins/daily')
    },
    POST_daily: async function (req, res, next) {
        try {
            let user = await Users.findOne({
                _id: res.locals.user._id
            })
            let n = moment().format('DD/MM/YYYY hh:mm'); // now 
            let l = moment(user.lastdailybonus, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY hh:mm') //last time bonus day
            let now = moment(n, 'DD/MM/YYYY hh:mm')
            let last = moment(l, 'DD/MM/YYYY hh:mm')
            let duration = moment.duration(now.diff(last));
            let hours = duration.asHours();
            console.log('before if sqdqs')
            if (hours >= 24) {
                console.log('inside if sdq')
                user.coins += dailyCoins;
                user.lastdailybonus = await moment().format('DD/MM/YYYY HH:mm')
                await user.save()
            }
        } catch (err) {
            next(err)
        }
        res.redirect('/earncoins/daily')
    },

    ////////////// VIDEOS /////////////////////



    GET_videos: async function (req, res) {
        var videoArray = await Videos.find()
        var video = videoArray[RandomVideo(0, videoArray.length)]
        res.render('earncoins/videos', {
            video: video
        })
    },



    POST_videos: async function (req, res, next) {
        try {

            let user = await Users.findOne({
                _id: res.locals.user._id
            })
            user.coins += videoCoins;
            await user.save()
        } catch (err) {
            next(err)
        }
        res.send('success')
    },
    ////////////////// INVITE //////////////////////////
    GET_invite: function (req, res) {
        res.render('earncoins/invite')
    },
    ////////////////////// CODE COUPONS ///////////////////////////////
    GET_code: function (req, res) {
        res.render('earncoins/code')
    },
    POST_code: async function (req, res, next) {
        let code = req.body.redeemcode

        if (validateCoupons(code)) {
            var coupon = await Coupons.findOne({
                couponCode: code
            })
            if (coupon != null) {
                try {
                    var user = await Users.findOne({
                        _id: res.locals.user._id
                    })
                    user.coins += coupon.couponCoins;
                    await user.save()
                    await coupon.remove()
                    res.redirect('/earncoins/code')
                } catch (error) {
                    next(error)

                }
            } else {
                req.flash('error', 'invalid coupon')
                res.redirect('/earncoins/code')
            }
        } else {
            req.flash('error', 'invalid coupon')
            res.redirect('/earncoins/code')
        }

    },
    /////////////////////// BUY ///////////////////////::
    GET_buy: function (req, res) {
        res.render('earncoins/buy')
    }

}


var RandomVideo = function RandomVideo(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

var validateCoupons = function (coupon) {
    if (cc.validate(coupon, {
            parts: 4
        }).length > 0) {
        return true
    }
    return false
}