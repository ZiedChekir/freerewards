//Models && Operations
var Users = require('../models/users')
var Videos = require('../models/videos')
var Missions = require('../models/missions')
var couponsModel = require('../models/couponsData')
var Coupons = require('../Operations/couponOperations')
var coinsTran = require('../Operations/coinOperations')
var missionOperations = require('../Operations/missionOperations')
var userOperations = require('../Operations/userOperations')


module.exports = {
    GET_offerwall: async function (req, res, next) {
        try {
            let missionObject = await missionOperations.queryMissions()
            let user = await userOperations.queryById(res.locals.user._id)
            let missionsToFilter
            let missions = missionObject[0]

            if (user.completedMissions.length == 0) {
                res.render('earncoins/missions', {
                    missions: true,
                    missionsToDisplay: missions.missions
                })
            } else {
                missionsToFilter = missions.missions.filter(function (mission) {
                    for (let i = 0; i < user.completedMissions.length; i++) {
                        if (mission.title == user.completedMissions[i]) {
                            return false
                        }
                    }
                    return mission
                })
                res.render('earncoins/missions', {
                    missions: true,
                    missionsToDisplay: missionsToFilter
                })
            }
        } catch (err) {
            next(err)
        }
    },
    POST_offerwall_mission_id: async function (req, res) {
        let id = req.params.id
        let missionToPush
        try {
            let miss = await missionOperations.queryMissions()
            let missions = miss[0].missions
            for (let i = 0; i < missions.length; i++) {
                if (missions[i].id == id)
                    missionToPush = missions[i]
            }
            let user = await userOperations.queryById(res.locals.user._id)
            user.completedMissions.push(missionToPush.title)
            user.save()
            res.redirect('/earncoins/missions')
        } catch (err) {
            next(err)
        }
    },

    /////////////// DAILY BONUS /////////////////////
    GET_daily: function (req, res,next) {
        res.render('earncoins/daily', { daily: true })
    },
    POST_daily: async function (req, res,next) {
        await coinsTran.updateDailyCoins(res.locals.user._id)
        res.redirect('/earncoins/daily')
    },
    ////////////// VIDEOS /////////////////////
    GET_videos:async function (req, res) {
        var f = await missionOperations.queryVideos()
    
        // let vid = vids[RandomVideo(0,vids.length )]	
        res.render('earncoins/videos', { videos: true, videoToDisplay: vid })
    },
    POST_videos:async function (req, res) {
        await coinsTran.updateVideoCoins(res.locals.user._id)
        res.redirect('/earncoins/videos')
    },
    ////////////////// INVITE //////////////////////////
    GET_invite:function (req, res) {
        res.render('earncoins/invite', { invite: true })
    },
    ////////////////////// CODE COUPONS ///////////////////////////////
    GET_code:function (req, res) {
        res.render('earncoins/code', { code: true })
    },
    POST_code:async function (req, res) {
        let code = req.body.redeemcode
    
        if (Coupons.validateCoupons(code)) {
            try {
                var coupon = await couponsModel.findOne({ couponCode: code })
                await coinsTran.updateCouponCoin(res.locals.user._id, coupon.couponCoins)
                await coupon.remove()
                res.redirect('/earncoins/code')
            } catch (error) {
                console.log("Failed!", error);
                res.redirect('/earncoins/code')
            }
    
        } else {
            res.redirect('/earncoins/code')
        }
    
    },
/////////////////////// BUY ///////////////////////::
    GET_buy:function (req, res) {
        res.render('earncoins/buy', { buy: true })
    }

}


function RandomVideo(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}