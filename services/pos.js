// services/intent.js
var mecab = require('mecab-ya');

exports.nouns = function(text, callback){
    mecab.pos(text, function(err, result){
    	let nouns = [];
    	if(result){
    		result.forEach(function(value){
    			if(['MAG', 'NNG'].indexOf(value[1]) >= 0){
    				nouns.push(value[0]);
    			}
    		});
    	}
    	callback(err, nouns);
    });
}