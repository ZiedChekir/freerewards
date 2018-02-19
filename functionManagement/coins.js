var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const crypto = require('crypto');

//This File responsible for coin's encryption and decryption
//it uses Strong Encryption That changes code for some value
// for example encrypt x => b 
// now encrypt x again => c see the diffrence that s the beauty of this encryption

const ENCRYPTION_KEY = "kjhszol125sdjn65893vbnaze4rg56b2"; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16


 module.exports = function coins(){
		//
	this.encryptcoins = function(value){
 		let iv = crypto.randomBytes(IV_LENGTH);
 		let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 		let encrypted = cipher.update(value);

 		encrypted = Buffer.concat([encrypted, cipher.final()]);
 		return iv.toString('hex') + ':' + encrypted.toString('hex');
	}
	this.decryptcoins = function(value){
 		let textParts = value.split(':');
 		let iv = new Buffer(textParts.shift(), 'hex');
 		let encryptedText = new Buffer(textParts.join(':'), 'hex');
 		let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 		let decrypted = decipher.update(encryptedText);
		
 		decrypted = Buffer.concat([decrypted, decipher.final()]);

		 return decrypted.toString();
	}
	this.initializeCoins = function(){
		let iv = crypto.randomBytes(IV_LENGTH);
 		let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 		let encrypted = cipher.update('0');

 		encrypted = Buffer.concat([encrypted, cipher.final()]);

 		return iv.toString('hex') + ':' + encrypted.toString('hex');
	}
}








// var encryptedText = encrypt(key, text);
// console.log(encryptedText);
// var decryptedText = decrypt(key, encryptedText);
// console.log( decryptedText);
