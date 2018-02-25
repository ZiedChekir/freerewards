var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://ziedchekir:ziedmessi!@ds151024.mlab.com:51024/freerewards');
var CouponsModel = require('../models/couponsData')
var Coupons = require('../Operations/couponOperations')
var coinsEncryption = require('../Operations/encryptCoins')
var coinsToAdd = 1000
var CouponsToGenerate = 100



for (var i = 0; i < CouponsToGenerate; i++) {
	var coupon = 
	new CouponsModel(
	{
		couponCode:	Coupons.generateCoupons(),
		couponCoins:coinsEncryption.encryptcoins(coinsToAdd.toString())
	})
	
	
	coupon.save(function(err,result){

		if(err) return handleError(err)
			if(i ==  CouponsToGenerate){
				mongoose.disconnect();
				console.log(result)	
			}

		})
	
}


//    function uniqueId() {
//   return 'id-' + Math.random().toString(36).substr(2, 16);
// };

