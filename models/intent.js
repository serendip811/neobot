var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var intentSchema = new Schema({
    key: String,	// menu
    name: String,	// 메뉴
    keywords: Array	// [메뉴, menu, 매뉴, 밥]
});

module.exports = mongoose.model('intent', intentSchema);