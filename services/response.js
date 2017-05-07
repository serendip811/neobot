// services/resonse.js
var ContextService = require('../services/context');
var ButtonService = require('../services/button');

// intent와 응답 로직이 추가될 때마다 요기 추가해주기
var MenuResponse = require('./responses/menu');
var StockResponse = require('./responses/stock');
var CoffeeResponse = require('./responses/coffee');
// var CoffeeResponse = require('./modules/coffee/response');
var FortuneResponse = require('./modules/fortune/response');
var AuthResponse = require('./modules/auth/response');

exports.getResponses = function(intent, entities, nouns, pos, context, callback){
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
		case 'coffee' :
			CoffeeResponse.getResponses(intent, entities, context, callback);
			break;
		case 'fortune' :
			FortuneResponse.getResponses(intent, entities, context, callback);
			break;
		case 'auth' :
			AuthResponse.getResponses(intent, entities, pos, context, callback);
			break;
		case 'init' :
			var response = {};
			response.intent = intent;
			response.entities = entities; // new_entities를 넣어준다.
			response.message = "처음 메뉴로 돌아갑니다."; // new_entities를 넣어준다.
			callback(response);
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
    // 일단은 첫번째꺼 리턴하기 ㅠ_ㅠ
    var response = responseCandidates[0];

    if(Object.keys(response).length === 0){
		// no response
		// TODO: 그냥 이렇게만 리턴해?
		// 이해하지 못하는 질문에 대해서 쌓아두자
		callback({message : '커피, 주식, 메뉴에 관련된 얘기를 해볼까요...?'});
    } else {
	    var user_key = context.user_key;
	    // 새 intent와 entities로 context넣어주자
	    var intent = response.intent;
	    var entities = response.entities;

	    // response에 button이 같이 온 경우는 해당 buttons로 response하고...
	    if(response.buttons){
		    	ContextService.setContext(user_key, intent, entities, function(){
				    console.log("response :", response);
					callback(response);
				});
	    } else {
	    	// 기본 keyboard 가져와서...
		    ButtonService.getKeyboard(function(keyboards){
		    	response.buttons = keyboards;
		    	ContextService.setContext(user_key, intent, entities, function(){
				    console.log("response :", response);
					callback(response);
				});
	        });	    	
	    }



    }
}