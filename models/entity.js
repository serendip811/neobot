var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entitySchema = new Schema({
    key: String,	// date, time, companyname, etc...
    name: String,	// 날짜, 시간, 회사이름, 등...
    default_value: String, // today, now, neowizgames, etc...
    values: Array	// date일때 : [오늘, 어제, 내일, 투모로, 명일 ...]
});

module.exports = mongoose.model('entity', entitySchema);