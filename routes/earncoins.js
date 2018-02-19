var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var coinsTran = require('../functionManagement/coinsTransaction')
var coinsTranInstance =  new coinsTran()
var Missions = require('../models/missions')
var Users = require('../models/users')
var Videos = require('../models/videos')
var Coupons = require('../functionManagement/coupons')
var couponsInstance = new Coupons()
var couponsModel = require('../models/couponsData')

router.get('/',ensureLoggedIn,  function(req, res)  {
	res.redirect('/earncoins/missions')
});


router.get('/missions',ensureLoggedIn,function(req,res){
	var missionsToFilter 
	Missions.getMissions(function(err,result){
		if(err) return handleError(err)

		Users.getUserById(res.locals.user._id,function(err,user){
			if(err) return handleError(err)
			if(user.completedMissions.length == 0){
				res.render('earncoins/missions',{missions:true,missionsToDisplay:result.missions})
			}else{				
				missionsToFilter  = result.missions.filter(function(mission){		
					for (var i = 0; i < user.completedMissions.length; i++) {
						if(mission.title == user.completedMissions[i]){
							return false
						}
					}
					return mission
				})
				res.render('earncoins/missions',{missions:true,missionsToDisplay:missionsToFilter})
			}
		})
			// res.render('earncoins/missions',{missions:true,v:allmissions})

	})
})
router.post('/missions/:id',ensureLoggedIn,function(req,res){
	var id = req.params.id
	var missionToPush
	Missions.getMissions(function(err,result){
		for (var i = 0; i < result.missions.length; i++) {
			if(result.missions[i].id == id)
			{
				missionToPush = result.missions[i]
			}
		}
		Users.findOne({'_id':res.locals.user._id},function(err,user){
			user.completedMissions.push(missionToPush.title)
			user.save(function(err){
				 if(err) return handleError(err)
			})
		})
		res.redirect('/earncoins/missions')
	})

})



router.get('/daily',ensureLoggedIn,function(req,res){
	res.render('earncoins/daily',{daily:true})

})

router.post('/daily',ensureLoggedIn,function(req,res){
	coinsTranInstance.updateDailyCoins(res.locals.user._id)
	res.redirect('/earncoins/daily')
})




router.get('/videos',ensureLoggedIn,function(req,res){
	Videos.getVideos(function(err,vids){
		
		var vid = vids[RandomVideo(0,vids.length )]
		
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
	var code = req.body.redeemcode
 	
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