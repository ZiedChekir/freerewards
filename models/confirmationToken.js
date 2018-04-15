var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var schema = new Schema({
   
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    // createdAt: { type: Date, required: true, default: Date.now, expires: 60 }
}, {
  timestamps: true,
  collection: 'confirmationToken'
});
schema.index({createdAt: 1},{expireAfterSeconds: 20});
module.exports = mongoose.model('confirmationToken', schema);