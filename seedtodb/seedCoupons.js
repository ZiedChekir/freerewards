var mongoose = require('mongoose')

var CouponsModel = require('../models/couponsData')
var Coupons = require('../Operations/couponOperations')
var coinsEncryption = require('../Operations/encryptCoins')
var coinsToAdd = 1000
var CouponsToGenerate = 100

mongoose.connect('mongodb://zied:zied1478963!@ds151024.mlab.com:51024/freerewards');
const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

for (var i = 0; i < CouponsToGenerate; i++) {
	var coupon = 
	new CouponsModel(
	{
		couponCode:	Coupons.generateCoupons(),
		couponCoins:1000
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

