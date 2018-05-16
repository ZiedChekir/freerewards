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
// console.log('Join millions of players to build a village, fo...'.length)


// a = ['asdq',]


// var a  = {
//     z:100,
//     c:50,
//     d:21
// }


// var string = 'hello, from the others side'

// string = string.replace(',','')



// var a = string.split(' ')
// var z = ''
// var b = []
// var num = 0
// a.forEach((x)=>{
//     if(x.length >= num){
//         if(x.length > num){
//             b = []
//         }
//         b.push(x)
//         num = x.length   
//     }
// })
// if(b.length == 1){
//     console.log(b[0])
// }else{
//     console.log(b)
// }

// console.log(string)



// module.exports = {
//     id: '1-step',

//     up : function(db, cb){
//         db.collection('testcollection').insert({ name: 'initial-setup' }, cb);
//     },

//     down : function(db, cb){
//         db.collection('testcollection').remove({ name: 'initial-setup' }, cb);
//     }
// }
// var a = [1,2,3,4,5,6]

// for (let i = 0; i < a.length; i++) {
//     console.log(a[i])
//     if(a[i] == 4){
//         console.log(i)
//         console.log(a[i])
//         break
//     }

// }
// console.log('fin du loop')
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');
// const msg = {
//   to: 'ziedchekir1@gmail.com',
//   from: 'noreply@freereward.com',
//   subject: 'sqddsqdqsd',
//   text: 'sqdsqdqssqddqsdqdsdq',
//   html: '<strong>sqddqssq1dqsdsqdqsdqsdqdsdq</strong>',
// };
// sgMail.send(msg);
// var siege = require('siege')
// siege()
//   .on(3111)
//   .for(10000).times
//   .get('/prizes')
//   .attack()


// Reqvalidate('ziedchekir1@gmail.com')
// function timeCounter() {
//   var before = new Date().getSeconds()

//   setTimeout(function () {
//     var after = new Date().getSeconds()
//     console.log(after - before)

//   },3000)

// }

// timeCounter()


// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// var apiKey = "6d1f984420ca4b25bb062e21e34d93ca"
// var baseUrl = "https://api.zerobounce.net/v1";
// var get = new XMLHttpRequest();

// function getCredits() {


//   var uri = baseUrl + "/getcredits" + "?apikey=" + apiKey;
//   request(uri,function(error, response, body){
//     console.log(error)
//     console.log(response)
//     console.log(body)
//   })
// }

// function validate(email) {
//   var before = new Date().getSeconds()
//   var uri = baseUrl + "/validate" + "?apikey=" + apiKey + "&email=" + email;

//   request(uri,function(error, response, body){
//     console.log(error)
//     console.log(response)
//     console.log(body)
//   })
//   }

// var request = require('request-promise')

// function Reqvalidate(email) {
//   var before = new Date().getSeconds()
//   var uri = baseUrl + "/validate" + "?apikey=" + apiKey + "&email=" + email;
//   request(uri, function (error, response, body) {
//     if (error) console.log('error')
//     console.log(body)
//     var after = new Date().getSeconds()
//     console.log('with request it took ' + after - before)
//   })
// }

// var zeroB = require('./config/zerobounce')
//  async function c(){

//   var a = await zeroB.validate('ziedchekir1@gmail.com')

//   console.log(a)
//   console.log('async ?')
// }

// c()


// var request = require('request')
// var uri = 'e24eaee6f1d89cc561153412d73edd10'

// request('https://api.everifier.org/v1/e24eaee6f1d89cc561153412d73edd10/verify/cokac@cars2.club',function(err,res,body){
//   console.log(body)
// })
// var valid = require('./config/zerobounce')
// valid.validate('chikenwings555@gmail.com').then(function(err,resp,body){
//   console.log(err)

// })
// console.log(a)
// function testAtack(){
// var siege = require('siege');
// siege()
//   .on(3111)
//   .for(5000).times
//   .get('/').for(2).seconds
//   .get('/user/login').for(3000).times
//   .get('/prizes').for(3000).times
//   .attack()
// }
// var req = require('request')
// req('https://freereward.herokuapp.com/checkcoins',function(err,res,body){
//   if(err) console.log(err)
//   console.log(body)
// })
// var a = "rocket_league"

// a.replace('_',' ')
// console.log(a)
// var a = 1940
// if(a% 100 == 0)
// console.log(a % 100)
// var a = [6, 2, 3, 8]

// function makeArrayConsecutive2(statues) {
//     var SmallestNum = Math.min(...statues)
//     var maxNum = Math.max(...statues)
  
//     var statuesMissing = 0
//     for (var i = SmallestNum; i < maxNum; i++) {
//         // console.log(SmallestNum+i)
//         console.log(i)
//         if (statues.indexOf( i) == -1) {
//             // console.log(i)
//             statuesMissing += 1
//         }

//     }
//     console.log(statuesMissing)
// }
// makeArrayConsecutive2(a)
// var a = [1, 3, 2, 1]
// function almostIncreasingSequence(sequence) { 
//     var originalLength = sequence.length   
//     var i = 0
//     var b = sequence.length  -1
//     while(i < b){
//         console.log('I is '+ i + '   and seq is   '+ sequence[i])
//         // if(sequence[i] >= sequence[i+1]){ 
//         //     if((sequence[i+1] > sequence[i-1]) || i == 0){
//         //                 console.log(i+' in bigger')
//         //                 sequence.splice(i, 1);
//         //             }else{
//         //                 console.log(i+' in smaller')
//         //                 sequence.splice(i+1, 1);  
//         //             }
//         //             i -=1
//         // }
        
//         if(sequence[i] >= sequence[i+1]){       
//             if((sequence[i+1] > sequence[i-1]) || i == 0){
                
//                 console.log(i+' in bigger')
//                 sequence.splice(i, 1);
//             }else{
//                 console.log(i+' in smaller')
//                 sequence.splice(i+1, 1);
//             }
//             i -=1
//             // b = sequence.length -2
            
//             if(originalLength - sequence.length >= 2 )
//               return   console.log(false)
//         }
//         i++
//     }
//     console.log('end test')
// console.log(true)
// console.log(sequence)

// }

// function almostIncreasingSequence(sequence) { 
//     var originalLength = sequence.length   
   
//     var err = 0
//     var i = 0
//     var b = sequence.length -1 
//     while(i < b){
//         if(sequence[i] >= sequence[i+1]){
         
//             if((sequence[i+1] > sequence[i-1]) || i == 0){
                
               
//                 sequence.splice(i, 1);
//             }else{
//                 sequence.splice(i+1, 1);
//             }
//             i=0
//             b = sequence.length -2
            
//             if(originalLength - sequence.length >= 2 )
//               return   console.log(false)
// //         }
// //         i++
// //     }

// // console.log(true)
// // console.log(sequence)

 
// //  }

// // almostIncreasingSequence(a)


// // function matrixElementsSum(matrix) {
// //     var sum = 0
// //     var MatrixLength = matrix[0].length
// //     for(var i = 0;i <MatrixLength ; i++ ){
// //         for(var k = 0; k < matrix.length;k++){
            
// //            if( matrix[k][i] == 0 ){
// //             break
// //            }else{
// //             sum +=  matrix[k][i]
// //            }
           
// //         }
// //     }
// //     return sum
// //     }
// // var mat =[[1,1,1,0], 
// // [0,5,0,1], 
// // [2,1,3,10]]
// //     matrixElementsSum(mat)
// // var i 
// // var b = 2 
// // console.log(i> b)

// // function allLongestStrings(inputArray) {
// //     var longLength = 0
// //     var array = []
// // for(var i = 0; i < inputArray.length;i++){
   
// //     if(inputArray[i].length >longLength){
// //         longLength = inputArray[i].length 
// //         array = []
// //         array.push(inputArray[i])
// //     }
// //      if(inputArray[i].length ==longLength){
// //         array.push(inputArray[i])
// //     }
    
// // }
// // }
// // var s = 'abcd'
// // // allLongestStrings(arr)
// // console.log(s[1])
// function commonCharacterCount(s1, s2) {  
//     s2 = s2.split('')
//     s1 = s1.split('')
//     var count = 0
//     var arr= {}
//     var b =0
    
//     for(var i = 0; i < s1.length ;i++){
//         console.log()
//         console.log(s2.indexOf(s1[0]))
//         // console.log(i)
//         // console.log(arr)
  
//     //   console.log(s2)
    
//         // console.log('b is '+b)
//         if(s2.indexOf(s1[i]) != -1 ){
//             // console.log(s1[i])
//             // console.log(s1[i])
            
//             count++
//             s2[s2.indexOf(s1[i])] = null
//             // s1.splice(i,1)
//             // console.log(s2[s2.indexOf(s1[i])])
//             // s2.splice(s2.indexOf(s1[i]),1)
//             // i -=1
//             // console.log(s1)
//             // console.log(s2)
//             // console.log('this is s1 after '+s1)
//             // console.log('thisis s2 after '+s2)
//             // console.log(s1[i])
//             // arr[s1[i]] = s2.indexOf(s1[i])   
//         }
     
//     }
   
//     console.log('count is ' +count)
// }
// var s1 =  "abca"
// var s2 =  "xyzbac"
// commonCharacterCount(s1,s2)
// function isLucky(n) {
//     n = n.toString().split('')
//     var a = n.length /2
//     var sum1 = 0
//     var sum2= 0
// for(var i =0; i < n.length;i++){
// //     if(i< a)
// //         sum1 += Number(n[i])
// //     else
// //         sum2 += Number(n[i])
// // }
// // console.log(sum1)
// // console.log(sum2)
// //     console.log( sum1 == sum2)
// // }
// // var n1 = 1230
// // isLucky(n1)
// var a = [-1, 150, 190, 170, -1, -1, 160, 180]
// var previous = 0
// var actualSmall= Math.max(...a)
// var treeIndex = []
// var newArr = []
// for (let i = 0; i < a.length; i++) {  

//     for (let k = 0; k < a.length; k++) {       
//         if(a[i] === -1){
//             if(treeIndex.indexOf(i) == -1){
//                 treeIndex.push(i)
//                 newArr.push(a[i])
//             }
//             break
//         }
//         if(previous < a[i] &&actualSmall > a[i] && a[i] != -1 ){
//             actualSmall = a[i]
//         }
//         if(i === a.length -1){
//             previous = actualSmall
//             newArr.push(previous)
//         }
    
//     }      
// }
// console.log(treeIndex)
// console.log(newArr)

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const msg = {
    to: 'ziedchekir1@gmail.com',
    from: 'noreply@freerewards.com',
    subject: 'Freerewards Email Reconfirmation',
    text: 'hello '  + ', please confirm your email by clicking this url1: '+'/confirm/' ,
    html: '<strong>hello '  + '</strong>, <p>please confirm your email by clicking this url: <a>'+'/confirm/' +  + '</a> '+ '</p>',
  };
  
  sgMail.send(msg);