// services/resonse.js
var ContextService = require('../services/context');

// 1. 가져온 응답들 중 Best를 뽑는다.
exports.selector = function(responseCandidates, context, callback){
	console.log("Response Selector");
    
    var response = responseCandidates[0];

    console.log("response :");
    console.log(response);

    if(Object.keys(response).length === 0){
		// no response
		callback('no response');
    } else {
	    var user_key = context.user_key;
	    var intent = response.intent;
	    var entities = response.entities;

		ContextService.setContext(user_key, intent, entities, function(){
			callback(response);
		});
    }
}