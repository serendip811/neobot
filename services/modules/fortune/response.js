// services/resonse/stock.js
var MessageService = require('../../../services/message');
var FortuneModel = require('./models/fortune');
var http = require('http');
var iconv = require('iconv-lite');

// TODO : 여기 menu,stock 등.. response에서 공통부분 있는거 빼서 정리하자.

// 포춘쿠키 가져와서 리턴
exports.getResponses = function(intent, entities, context, callback){
	console.log("fortune getResponses");

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

		function handleResponse(response) {
			var serverData = '';
			response.on('data', function (chunk) {
				serverData = iconv.decode(chunk, 'EUC-KR').toString(); 
			});

			response.on('end', function () {
				console.log("Response Status:", response.statusCode);
				console.log("Response Headers:", response.headers);
				console.log("Response ServerData:",serverData);

				message = serverData.replace(/\r\n/g, '');

				// mongo에 message 저장
			    var fortune = new FortuneModel({
			    	user_key : context.user_key,
			    	message : message
			    });
			    fortune.save();

				my_callback(intent, new_entities, message);
			});
		}		

		// mongo에 있으면 mongo에서, 없으면 request 날리기
		// mongo expire는 2시간 (7200초)
		FortuneModel.findOne({user_key : user_key}, function(err, fortune){
			if(err) return res.status(500).send({error: 'database failure'});
			if(fortune){
	        	my_callback(intent, new_entities, fortune.message);	
			} else {
				http.request({
					host : 'fortune01.nate.com', 
					port : 80,
					path : '/contents/free/fortunecookie_data.jsp'
				}, function(response){
					handleResponse(response);
				}).end();
			}
	    });
	});
}
