// services/intent.js
var IntentModel = require('../models/intent');

exports.getIntent = function(content, callback){
	console.log('getIntent');
    IntentModel.find(function(err, intents){
        if(err) return res.status(500).send({error: 'database failure'});

        var expect_intent = {};
        for(let intent_idx in intents){
        	let intent = intents[intent_idx];
        	for(let i = 0; i < intent.keywords.length; i++){
        		if(content.includes(intent.keywords[i])){
        			expect_intent.key = intent.key;
        			expect_intent.name = intent.name;
        		}
        	}
        }
        callback(expect_intent);
    });


}