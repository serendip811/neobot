// services/resonse/stock.js
var MessageService = require('../../../services/message');
var firebase = require("firebase");

exports.getResponses = function(intent, entities, pos, context, callback){
	console.log("weather getResponses");

	var my_callback = function(intent, entities, message){
		var response = {};
		response.intent = intent;
		response.entities = entities; // new_entities를 넣어준다.
		response.message = message; // new_entities를 넣어준다.

		callback(response);
	}
	// 필요한 entities를 채우고...
	MessageService.fillIntentEntites(intent, entities, context, function(new_entities){
		var message = '';

		firebase.database().ref('/weather/now').once('value').then(function(snapshot) {
			if(snapshot.val() == null) {
				// 
				firebase.database().ref('users/' + userkey.neowiz_id).set({
					subscription: true
				});
				my_callback(intent, new_entities, "날씨...는 맑은 뒤 흐림");
			} else {
				var weather = snapshot.val();
				var message = weather.w1 + '\r\n' + weather.w2 + '\r\n' + weather.w3 + '\r\n' + weather.w4 + '\r\n';

				my_callback(intent, new_entities, message);
			}
		});
	});
}
