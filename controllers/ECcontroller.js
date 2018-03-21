//Models && Operations
var Users = require('../models/users')
var Videos = require('../models/videos')
var Missions = require('../models/missions')
var couponsModel = require('../models/couponsData')
var Coupons = require('../Operations/couponOperations')
var CoinOperations = require('../Operations/coinOperations')
var missionOperations = require('../Operations/missionOperations')
var userOperations = require('../Operations/userOperations')
var videoOperations = require('../Operations/videoOperations')

var Videos = require('../models/videos')


module.exports = {
    GET_offerwall: async function (req, res, next) {
        try {
            let missionArray = await missionOperations.queryMissions()
            let user = await userOperations.queryById(res.locals.user._id)
            let missionsToFilter
            let missions = missionArray
            
            if (user.completedMissions.length == 0) {
                res.render('earncoins/offerwall', {
                    missions: true,
                    missionsToDisplay: missions
                })
            } else {
                missionsToFilter = missions.filter(function (mission) {
                    for (let i = 0; i < user.completedMissions.length; i++) {
                        if (mission.title == user.completedMissions[i]) {
                            return false
                        }
                    }
                    return mission
                })
                res.render('earncoins/offerwall', {
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
        let missionCoins = 0;
        try {
            let mission = await  Missions.findOne({id:id})   
                 
            let user = await Users.findOne({_id:res.locals.user._id})
            user.completedMissions.map(function(x){
                if(x == mission.title){
                    console.log("mission already done")
                    return res.redirect('/earncoins/offerwall')
                }
            })
          
            console.log('after for loop')      
            user.completedMissions.push(mission.title)
            console.log("before updating user coins")
             user.coins += mission.coins
            await user.save()
           
            res.redirect('/earncoins/offerwall')

        } catch (err) {
            next(err)
            console.log('Error Catched ')
            res.redirect('/earncoins/offerwall')

        }
    },

    /////////////// DAILY BONUS /////////////////////
    GET_daily: function (req, res,next) {
        res.render('earncoins/daily', { daily: true })
    },
    POST_daily: async function (req, res,next) {
        await CoinOperations.updateDailyCoins(res.locals.user._id)
        res.redirect('/earncoins/daily')
    },
    
    ////////////// VIDEOS /////////////////////



    GET_videos:async function (req, res) {
       var videoArray = await Videos.find()
       var video = videoArray[RandomVideo(0,videoArray.length )]
        res.render('earncoins/videos', { videos: true, video: video })
    },



    POST_videos:async function (req, res,next) {
        console.log('what s going on ')
        await videoOperations.updateVideoCoins(res.locals.user._id)
       
        res.send('success')
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
                await Coupons.updateCouponCoins(res.locals.user._id, coupon.couponCoins)
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