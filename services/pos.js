// services/intent.js
var mecab = require('mecab-ya');

exports.nouns = function(text, callback){
    console.log("pos nouns");
    mecab.pos(text, function(err, result){
    	var nouns = [];
    	if(result){
            console.log(result);
    		result.forEach(function(value){
    			if(['MAG', 'NNG'].indexOf(value[1]) >= 0){
    				nouns.push(value[0]);
    			}
    		});
    	}
    	callback(err, nouns);
    });
};
