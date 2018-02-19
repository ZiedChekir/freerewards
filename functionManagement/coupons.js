 var cc = require('coupon-code');

module.exports = function coupons(){
	this.validateCoupons = function (coupon){
		if(cc.validate(coupon, { parts : 4 }).length > 0)
		{
			return true
		}
		return false
	}
	this.generateCoupons = function(){
		return cc.generate({parts:4})
	}
}
