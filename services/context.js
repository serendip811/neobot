// services/context.js
var ContextModel = require('../models/context');

exports.getContexts = function(content, callback){
	console.log('getContexts');
    ContextModel.find(function(err, contexts){
        if(err) return res.status(500).send({error: 'database failure'});

        var expect_contexts = [];
        for(let context_idx in contexts){
        	let context = contexts[context_idx];
        	for(let i = 0; i < context.keywords.length; i++){
        		if(content.includes(context.keywords[i])){
        			let expect_context = {};
        			expect_context.key = context.key;
        			expect_context.name = context.name;
        			expect_contexts.push(expect_context);
        		}
        	}
        }
        callback(expect_contexts);
    });


}