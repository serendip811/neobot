// services/resonse/factory.js

// intent와 응답 로직이 추가될 때마다 요기 추가해주기
var MenuResponse = require('./menu');
var StockResponse = require('./stock');

exports.getResponses = function(intent, entities, context, callback){
	console.log("factory getResponses");

	var intent_name = '';
	if(typeof intent === 'object')
		intent_name = intent.key;

	// intent와 응답 로직이 추가될 때마다 요기 추가해주기
	switch (intent_name) {
		case 'menu' :
			MenuResponse.getResponses(intent, entities, context, callback);
			break;
		case 'stock' :
			StockResponse.getResponses(intent, entities, context, callback);
			break;
		default :
			// intent가 없는 경우 빈 response return
			// context에도 intent가 없고 message에서 아무런 intent도 뽑을 수 없는 경우
			// 달리 응답해줄 것이 없다.
			callback({});
			break;
	}
}