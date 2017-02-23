// services/intent.js
var IntentModel = require('../models/intent');

exports.classfication = function(nouns, callback){
    console.log('Intent Classfication');

    var itemProcessed = 0;
    var expect_intents = [];
    nouns.forEach(function(value){
    	IntentModel.find({keywords : value}, function(err, intents){
    		if(err) return res.status(500).send({error: 'database failure'});
    		
	        for(let intent_idx in intents){
	        	let expect_intent = {};
	        	expect_intent.key = intents[intent_idx].key;
	        	expect_intent.name = intents[intent_idx].key;

	        	expect_intents.push(expect_intent);
	        }
	        
	        itemProcessed++;
    		if(itemProcessed === nouns.length){
    			callback(expect_intents);
    		}
    	});
    });
    
}