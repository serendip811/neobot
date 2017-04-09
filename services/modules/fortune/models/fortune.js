var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fortuneSchema = new Schema({
    user_key: String,	// 사용자키
    date: { type: Date, default: Date.now},
    message: String
});

module.exports = mongoose.model('fortune', fortuneSchema);