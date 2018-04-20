var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var schema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
   
}, {
  timestamps: true,
  collection: 'passwordResetToken'
});

module.exports = mongoose.model('passwordResetToken', schema);