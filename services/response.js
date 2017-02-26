// services/resonse.js
var ContextService = require('../services/context');

// intent와 응답 로직이 추가될 때마다 요기 추가해주기
var MenuResponse = require('./responses/menu');
var StockResponse = require('./responses/stock');

exports.getResponses = function(intent, entities, context, callback){
	console.log("response getResponses");

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

// 1. 가져온 응답들 중 Best를 뽑는다.
exports.selector = function(responseCandidates, context, callback){
	console.log("Response Selector");
    
    // TODO: 여기 best를 뽑는 로직 넣기
    var response = responseCandidates[0];

    console.log("response :");
    console.log(response);

    if(Object.keys(response).length === 0){
		// no response
		// TODO: 그냥 이렇게만 리턴해?
		callback('no response');
    } else {
	    var user_key = context.user_key;
	    var intent = response.intent;
	    var entities = response.entities;

		ContextService.setContext(user_key, intent, entities, function(){

			// TODO: 그냥 이렇게만 리턴해?
			// 카카오에 맞는 형식으로 잘 바꿔서 json으로 이쁘게 return 해줘야 할텐데? 여기서 할지 밖에서 할지는 고민
			callback(response);
		});
    }
}