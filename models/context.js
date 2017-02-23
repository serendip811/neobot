var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contextSchema = new Schema({
    user_key: String,
    intent: String,
    entities: Array
});

module.exports = mongoose.model('context', contextSchema);