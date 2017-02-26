// services/resonse/stock.js
var MessageService = require('../../services/message');
var https = require('https');

// TODO : 여기 menu,stock 등.. response에서 공통부분 있는거 빼서 정리하자.

// 주식 정보 가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("stock getResponses");

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
				serverData += chunk;
			});
			response.on('end', function () {
				console.log("Response Status:", response.statusCode);
				console.log("Response Headers:", response.headers);
				console.log("Response ServerData:",serverData);

				serverData = serverData.substring(5, serverData.length);
				var stock = JSON.parse(serverData);
				stock = stock.tnv.value;
				stock = JSON.parse(stock);
				stock = stock.v[0][stock.v[0].length-1];
				message = '[NEOWIZ GAMES] '+ stock + '\n화...화이팅!';
				my_callback(intent, new_entities, message);
			});
		}

		https.request({
		host : 'www.google.co.kr', 
		port : 443,
		path : '/async/finance_chart_data?async=q:095660,x:KOSDAQ,p:1d,i:600,_fmt:json'
		}, function(response){
			handleResponse(response);
		}).end();
	});
}