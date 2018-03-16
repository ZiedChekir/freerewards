var cc = require('coupon-code');
const userOperations = require('../Operations/userOperations')
module.exports = {
	validateCoupons: function (coupon) {
		if (cc.validate(coupon, { parts: 4 }).length > 0) {
			return true
		}
		return false
	},
	generateCoupons: function () {
		return cc.generate({ parts: 4 })
	},
	
	updateCouponCoins: async function (userid, couponcoins) {
		try {
			let user = await userOperations.queryById(userid)
			user.coins += couponcoins;
			await user.save()
		} catch (err) {
			console.log(err)
		}


	}
}
