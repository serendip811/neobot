var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var keyboardSchema = new Schema({
    type: String,
    buttons: Array
});

module.exports = mongoose.model('keyboard', keyboardSchema);