// services/resonse.js
var ContextService = require('../services/context');

// 1. 가져온 응답들 중 Best를 뽑는다.
exports.selector = function(responseCandidates, context, callback){
	console.log("Response Selector");
    
    var response = responseCandidates[0];

    var user_key = context.user_key;
    var intent = {};
    var entities = [{},{}];

	ContextService.setContext(user_key, intent, entities, function(){
		callback(response);
	});
}