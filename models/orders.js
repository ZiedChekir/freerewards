var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Orders = new Schema({
    username:{type:String , required:true},
    email:{type:String , required:true},
    game:{type:String , required:true},
    gameId:{type:String,required:true},
    price :{type:Number, required:true},
    completed:{type:Boolean,required:true,default:false},
    key:{type:String,default:null}

},{collection:'orders'})

module.exports = mongoose.model('orders',Orders)