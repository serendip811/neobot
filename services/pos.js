// services/intent.js
var mecab = require('mecab-ya');

exports.nouns = function(text, callback){
    console.log("pos nouns");
    mecab.pos(text, function(err, result){
    	var nouns = [];
        console.log("pos : ", result);
        if(typeof result === 'undefined') {
            // mecab 이 제대로 안되면 ㅠ_ㅠ
            if(text.indexOf('커피') >= 0){
                nouns.push('커피')
            }
            if(text.indexOf('메뉴') >= 0){
                nouns.push('메뉴')
            }
            if(text.indexOf('주식') >= 0){
                nouns.push('주식')
            }
        }

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
