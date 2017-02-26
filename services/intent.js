// services/intent.js
var IntentModel = require('../models/intent');

exports.classfication = function(nouns, callback){
    console.log('Intent Classfication');

    if(nouns.length === 0){
        // 빈 array callback
        callback([]);
    }

    var itemProcessed = 0;
    var expect_intents = [];
    nouns.forEach(function(value){
    	IntentModel.find({keywords : value}, function(err, intents){
    		if(err) return res.status(500).send({error: 'database failure'});
    		
	        for(var intent_idx in intents){
	        	expect_intents.push(intents[intent_idx]);
	        }
	        
	        itemProcessed++;
    		if(itemProcessed === nouns.length){
    			callback(expect_intents);
    		}
    	});
    });
};
