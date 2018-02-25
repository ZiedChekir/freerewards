var cc = require('coupon-code');

module.exports = {
	validateCoupons: function (coupon) {
		if (cc.validate(coupon, { parts: 4 }).length > 0) {
			return true
		}
		return false
	},
	generateCoupons: function () {
		return cc.generate({ parts: 4 })
	}
}
