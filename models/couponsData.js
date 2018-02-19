var mongoose = require('mongoose')

var CouponsSchema = mongoose.Schema({

	couponCode:{
		required:true,
		type:String
	},
	couponCoins:{
		required:true,
		type:String
	}

},{collection:'Coupons'})

var Coupons = module.exports = mongoose.model('Coupons',CouponsSchema)
module.exports.queryCoupon = function(code,callback){
	Coupons.findOne({couponCode:code},callback)
}

