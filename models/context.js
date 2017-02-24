var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contextSchema = new Schema({
    user_key: String,
    intent: Schema.Types.Mixed,
    entities: Array,
    date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('context', contextSchema);