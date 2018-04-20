var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var schema = new Schema({ 
     createdAt:{type:Date,required:true},
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
}, {
 
  collection: 'confirmationToken'
})


module.exports = mongoose.model('confirmationToken', schema);