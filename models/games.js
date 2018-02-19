var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var schema = new Schema({
  title:{type:String, required:true},
  imgPath:{type:String, required:true},
  description:{type:String, required:true},
  category:{type:String, required:true},
  information:{type:String, required:true},
  price:{type:Number, required:true}
},{collection:'games'});

module.exports = mongoose.model('games', schema);
