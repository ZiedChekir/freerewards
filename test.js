// // // var Cryptr = require('cryptr'),
// // //     cryptr = new Cryptr('dsqdqsdsqdqsdv51616513134132dqs31bc31v');
 
 
// // // var encryptedString = cryptr.encrypt('bacon'),
// // //     decryptedString = cryptr.decrypt(encryptedString);
 
// // // console.log(encryptedString);  // d7233809c0 
// // // console.log(decryptedString);  // bacon 

// // var crypto = require("crypto")
// // var key = "qsdqsdqdqsdk"
// //8335728bcaf48908975f99e44b4d2840

// // function encryptcoins(data){
		
	
// // 		var cipher = crypto.createCipher('aes-256-cbc', key);
// //         var crypted = cipher.update(data, 'utf-8', 'hex');
// //        	crypted += cipher.final('hex');

// //         return crypted;
// // 	}
// // 	 function decryptcoins(data){
// // 	   var decipher = crypto.createDecipher('aes-256-cbc', key);
// //         var decrypted = decipher.update(data, 'hex', 'utf-8');
// //         decrypted += decipher.final('utf-8');

// //         return decrypted;
// // 	}

// // var text = encryptcoins('85');
// // console.log(text);


// // function test(min, max){
// // 	return min > max ? true : false;
// // }
// // console.log(test(5,30))
// // var d = new Date()
// // console.log((d.getDate()+"/"+(d.getMonth()+1)+"/" +d.getFullYear()).toString())


// var shortid = require('shortid');
 
// console.log(shortid.generate);



// const crypto = require('crypto');

// const ENCRYPTION_KEY = "kjhszol125sdjn65893vbnaze4rg56b2"; // Must be 256 bytes (32 characters)
// const IV_LENGTH = 16; // For AES, this is always 16

// function encrypt(text) {
//  let iv = crypto.randomBytes(IV_LENGTH);
//  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
//  let encrypted = cipher.update(text);

//  encrypted = Buffer.concat([encrypted, cipher.final()]);

//  return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//  let textParts = text.split(':');
//  let iv = new Buffer(textParts.shift(), 'hex');
//  let encryptedText = new Buffer(textParts.join(':'), 'hex');
//  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
//  let decrypted = decipher.update(encryptedText);

//  decrypted = Buffer.concat([decrypted, decipher.final()]);

//  return decrypted.toString();
// }

// // var d = new Date()
// // var v = -3
// // console.log(("date: "+(d.getDate() + v) +"/"+(d.getMonth()+1)+"/" +d.getFullYear() + " time: "+(d.getHours())+":"+(d.getMinutes())).toString())

// // var p = 'date: 5/2/2018 time: 18:41'
// // console.log(p.substring(p.indexOf('/')+1,p.indexOf('/',p.indexOf('/')+1)))
// // console.log(p.substring(p.lastIndexOf(':')+1,p.length))
// // console.log(p.substring(p.lastIndexOf('time')+6,p.lastIndexOf(':')))
// // console.log(d.getHours())
// // var moment = require('moment')

// // var s =moment().format('DD/MM/YYYY hh:mm');
// // var p = moment('08/02/2018 23:09','DD/MM/YYYY hh:mm').format('DD/MM/YYYY hh:mm')

// // var now = moment(moment().format('DD/MM/YYYY hh:mm'),'DD/MM/YYYY hh:mm')
// // var lastdaily = moment(p,'DD/MM/YYYY hh:mm')

 
// // var duration = moment.duration(now.diff(lastdaily));
// // var hours = duration.asHours();
// // console.log(typeof(hours))
// // function getDate(){
// // 	return moment().subtract(1,'days').format('DD/MM/YYYY HH:mm')
// // }
// // console.log(getDate())









// //  module.exports = function coins(){
		
// // 	this.encryptcoins = function(data){
// // 		var cipher = crypto.createCipher('aes-256-cbc', key);
// //         var crypted = cipher.update(data, 'utf-8', 'hex');
// //        	crypted += cipher.final('hex');

// //         return crypted;
// // 	}
// // 	this.decryptcoins = function(data){
// // 	   var decipher = crypto.createDecipher('aes-256-cbc', key);
// //         var decrypted = decipher.update(data, 'hex', 'utf-8');
// //         decrypted += decipher.final('utf-8');

// //         return decrypted;
// // // 	}
// // // }










// // var missionsToFilter =[ 
// //         {
// //             "coins" : "84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c",
// //             "link" : "www.example.com",
// //             "description" : "bdazleazeqsdbqsdqsdsqdqs",
// //             "title" : "clas of clans"
// //         }, 
// //          {
// //             "coins" : "84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c",
// //             "link" : "www.example.com",
// //             "description" : "bdazleazeqsdbqsdqsdsqdqs",
// //             "title" : "gdsg"
// //         }, 
// //          {
// //             "coins" : "84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c",
// //             "link" : "www.example.com",
// //             "description" : "bdazleazeqsdbqsdqsdsqdqs",
// //             "title" : "xw wxc"
// //         }, 
// //          {
// //             "coins" : "84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c",
// //             "link" : "www.example.com",
// //             "description" : "bdazleazeqsdbqsdqsdsqdqs",
// //             "title" : "happy"
// //         }, 
// //         {
// //             "coins" : "64f84d0d88d443a75c972c5c4fa8f418:227e9f493cd2b5ebece17b8567a19113",
// //             "link" : "www.haudsik.com",
// //             "description" : "sdqsjldkjp^jzaijnf",
// //             "title" : "world of warcraft"
// //         }
// //     ]


// // // var completedMiss=['happy','world of warcraft','xw wxc']

// // // var v = missionsToFilter.filter(function(mission){		
// // // 	for (var i = 0; i < completedMiss.length; i++) {
// // // 		if(mission.title == completedMiss[i]){
// // // 			return false
// // // 		}
// // // 	}
// // // 	return mission
// // // })

// // var count = 0
// // while(true){
// // 	console.log(RandomVideo(0,7))
	
// // }
// var cc = require('coupon-code');
// // var coupon =  '9GkG-J99U-N6FD-MWW9'

// // if(cc.validate(coupon, { parts : 4 }).length > 0)
// // {
// // 	console.log('hi')
// // }
// console.log(cc.generate({ parts : 4 }))
// // var voucher_codes = require('voucher-code-generator');
// // console.log(voucher_codes.generate({
// //     pattern: "####-####-####-####",
// //     charset: voucher_codes.charset("alphanumeric")
// // }))
// console.log(cc.generate({parts:4}))


// function truncateString(str, num) {
//     // Clear out that junk in your trunk
    
//     if(str.length < num){
//       console.log(str)
//     } 
   
    
//     if(num <= 3){
//        str +='...';
//        console.log(str)
//     }
    
//     if(num >3){
//       var b = str.substring(0,(num-3));
//       b += '...';
//       console.log(b)
//     }
//   }
  
//   truncateString("A-tisket a-tasket A green and yellow basket", 11);





// function mutation(arr) {
//     var a = arr[0].toLowerCase();
//     var b = arr[1].toLowerCase();
//     for(var i = 0; i < a.length; i ++){
        
//         if(b.indexOf(a.charAt(i)) == -1){
            
//             return console.log('no')

//         }
    
//   }
//   return console.log('yes')
// }

  
// mutation(["zyxwvutsrqponmlkjihgfedcba", "qrstu"])
  

// function bouncer(arr) {
//     // Don't show a false ID to this bouncer.
//    var a =  arr.filter(Boolean)
//    console.log(a)
//   }
  
//   bouncer([false, null, 0, NaN, undefined, "","sd"])
//   function person(bool,t){
//     this.bool= bool
//     this.t = t
//   }

//   var a = new person(false,'hi')


// console.log(a)



// var body = {
//   "success": true,
//    "challenge_ts": "2018-03-18T15:54:01Z",
//    "hostname": "freereward.herokuapp.com"
//  }
//  console.log(body)
//  console.log(body['success'])
// var date = new Date()
// var isodate = new Date().toISOString()
// console.log(date)
// console.log(isodate)


// function SortedBy(sort){
// 	var sortBy = ''
// 	if(sort =='recent'){
// 		return 'desc'
// 	}
// 	if(sort == 'oldest'){
// 		return  'asc'
// 	}
// 	if(sort == 'popular'){
// 		return ''
// 	}
// }
console.log('Join millions of players to build a village, fo...'.length)


a = ['asdq',]