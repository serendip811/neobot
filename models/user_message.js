var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userMessageSchema = new Schema({
    user_key: String,
    intent: String,
    contexts: Array,
    date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('user_message', userMessageSchema);