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
    POST_offerwall_mission_id: async function (req, res, next) {
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
            updateCoinsInTheParentUser(user.refferedBy, user._id, mission.coins)
            updateCurrentUserCoins (user,mission.coins)
            user.completedMissions.map(function (x) {
                
                if (x == mission.title) {
                    
                    return res.redirect('/earncoins/offerwall')
                }
            })
            
            user.completedMissions.push(mission.title);
            user.save(function(err,result){
                if(err) return next(err)
                res.redirect('/earncoins/offerwall')
            })     
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
            if (hours >= 24) {       
                user.totalCoins += dailyCoins;
                user.lastdailybonus = await moment().format('DD/MM/YYYY HH:mm')
                updateCoinsInTheParentUser(user.refferedBy, user._id, dailyCoins)
                updateCurrentUserCoins(user,dailyCoins) 
                await user.save()
            }
        } catch (err) {
            next(err)
        }
        res.redirect('/earncoins/daily')
    },

    ////////////// VIDEOS /////////////////////



    GET_videos: async function (req, res) {
        let videoArray = await Videos.find({
            $where: 'this.viewsCount < this.maxViews'
        }).sort({
            'viewsCount': 'asc'
        })
        var video = videoArray[0]
        res.render('earncoins/videos', {
            video: video
        })
    },



    POST_videos: async function (req, res, next) {
        try {
            // if(!(req.body.percent >= 2)){
            //     req.flash('error','you need to watch the video')
            //     return res.redirect('/earncoins/videos')
            // }
            let video = await Videos.findOne({
                _id: req.body.videoId
            })
            let user = await Users.findOne({
                _id: res.locals.user._id
            })

            video.viewsCount += 1;
            user.coins += videoCoins;
            updateCoinsInTheParentUser(user.refferedBy, user._id, videoCoins)
            updateCurrentUserCoins(user,videoCoins) 

            await video.save()
            await user.save()
            res.send('success')
        } catch (err) {
            next(err)
        }

    },
    ////////////////// INVITE //////////////////////////
    GET_invite:async function (req, res) {
        let user = await Users.findOne({_id:req.user._id})
        res.render('earncoins/invite',{refUrl:user.refferalUrl})
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
                    updateCurrentUserCoins(user,coupon.couponCoins) 
                    updateCoinsInTheParentUser(user.refferedBy, user._id, couponCoins)
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

function updateCoinsInTheParentUser(refferedBy, thisUserId, coinsToAdd) {
    if(refferedBy){
        let percentage = 3
        let coinsAfterPercentage = (coinsToAdd /100 *percentage)
        Users.findOne({_id: refferedBy}, function (err, refUser) {
            refUser.totalCoins += coinsAfterPercentage
            refUser.childCoins += coinsAfterPercentage
            for (let i = 0; i < refUser.refferedUsers.length; i++) {
                
                if (refUser.refferedUsers[i].id.toString() == thisUserId.toString()) {
                    
                    refUser.refferedUsers[i].coins += coinsAfterPercentage
                    
                    refUser.save(function (err) {
                        if (err) return console.log(err)
                    })                
                    break;
                }    
            }
        })
    }
}
function updateCurrentUserCoins (user,coins){
    user.Earnedcoins += coins
    user.totalCoins += coins

}
