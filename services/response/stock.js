// services/resonse/stock.js

// 주식 정보 가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("stock getResponses");
	var response = {};




	response.intent = intent;
	response.entities = entities;
	
	callback(response);

}