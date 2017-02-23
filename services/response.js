// services/resonse.js

// 1. 가져온 응답들 중 Best를 뽑는다.
exports.selector = function(responseCandidates, context, callback){
	console.log("Response Selector");
    
    var response = responseCandidates[0];

    callback(response);
}