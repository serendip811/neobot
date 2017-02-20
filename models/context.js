var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contextSchema = new Schema({
    key: String,	// date, time, companyname, etc...
    name: String,	// 오늘, 아침, 네오위즈게임즈, 등...
    default_value: String,
    keywords: Array	// date일때 : [오늘, 어제, 내일, 투모로, 명일 ...]
});

module.exports = mongoose.model('context', contextSchema);