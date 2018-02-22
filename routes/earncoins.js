var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
//Models && Operations
var Users = require('../models/users')
var Videos = require('../models/videos')
var Missions = require('../models/missions')
var couponsModel = require('../models/couponsData')
var Coupons = require('../functionManagement/coupons')
var coinsTran = require('../functionManagement/coinsTransaction')
var missionOperations = require('../Operations/missionOperations')
var userOperations = require('../Operations/userOperations')
///INSTANCES
var coinsTranInstance =  new coinsTran()
var couponsInstance = new Coupons()


router.get('/',ensureLoggedIn,  function(req, res)  {
	res.redirect('/earncoins/missions')
});

router.get('/missions',ensureLoggedIn,async function(req,res,next){
	try{
		let missionObject = await missionOperations.queryMissions()
		let user = await userOperations.queryById(res.locals.user._id)
		let missionsToFilter
		let missions = missionObject[0]

		if(user.completedMissions.length == 0){
			res.render('earncoins/missions',{missions:true,missionsToDisplay:missions.missions})
		}
		else{				
			missionsToFilter  = missions.missions.filter(function(mission){		
				for (let i = 0; i < user.completedMissions.length; i++) {
					if(mission.title == user.completedMissions[i]){
						return false
					}
				}
				return mission
			})
			res.render('earncoins/missions',{missions:true,missionsToDisplay:missionsToFilter})
		}	
	}catch(err){
		next(err)
	}
})

router.post('/missions/:id',ensureLoggedIn,async function(req,res){
	let id = req.params.id
	let missionToPush
try{
	let miss = await missionOperations.queryMissions()
	let missions = miss[0].missions
		for (let i = 0; i < missions.length; i++) {
			if(missions[i].id == id)		
				missionToPush = missions[i]			
		}
		let user = await userOperations.queryById(res.locals.user._id)
		user.completedMissions.push(missionToPush.title)
		user.save()	
		res.redirect('/earncoins/missions')
	}catch(err){
		next(err)
	}
})

router.get('/daily',ensureLoggedIn,function(req,res){
	res.render('earncoins/daily',{daily:true})
})



router.post('/daily',ensureLoggedIn,async function(req,res){
	await coinsTranInstance.updateDailyCoins(res.locals.user._id)
	res.redirect('/earncoins/daily')
})




router.get('/videos',ensureLoggedIn,function(req,res){
	Videos.getVideos(function(err,vids){		
		let vid = vids[RandomVideo(0,vids.length )]	
		res.render('earncoins/videos',{videos:true,videoToDisplay:vid})
	})
	
})
router.post('/videos',ensureLoggedIn,function(req,res){
	coinsTranInstance.updateVideoCoins(res.locals.user._id)
	res.redirect('/earncoins/videos')
})




router.get('/invite',ensureLoggedIn,function(req,res){
	res.render('earncoins/invite',{invite:true})
})



router.get('/code',ensureLoggedIn,function(req,res){
	res.render('earncoins/code',{code:true})

})

router.post('/code',ensureLoggedIn,function(req,res){
	let code = req.body.redeemcode
 	
	if(couponsInstance.validateCoupons(code)){
		couponsModel.queryCoupon(code,function(err,result){
			if(err) return handleError(err)
				if(!result){
					res.redirect('/earncoins/code')
				}else{
					coinsTranInstance.updateCouponCoin(res.locals.user._id,result.couponCoins)
					result.remove()
					res.redirect('/earncoins/code')
				}
				
			
			
		})
	
	}else{
		res.redirect('/earncoins/code')
	}
	
})



router.get('/buy',ensureLoggedIn,function(req,res){
	res.render('earncoins/buy',{buy:true})
})


module.exports = router;


function RandomVideo(min,max){
			return Math.floor(Math.random() * (max - min) + min)
		}