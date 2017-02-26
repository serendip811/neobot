// services/resonse/menu.js
var MessageService = require('../../services/message');
var https = require('https');
var moment = require('moment');

// TODO : 여기 menu,stock 등.. response에서 공통부분 있는거 빼서 정리하자.
// 아마 response.js로 넣을 수 있을듯

// 네오위즈 식사 메뉴가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("menu getResponses");

	var my_callback = function(intent, entities, message){
		var response = {};
		response.intent = intent;
		response.entities = entities; // new_entities를 넣어준다.
		response.message = message; // new_entities를 넣어준다.

		callback(response);
	}

	// 필요한 entities를 채우고...
	MessageService.fillIntentEntites(intent, entities, context, function(new_entities){
		// my_callback(intent, new_entities, '');

		var message = '';
		// entity에 value가 없는 경우
		var date = '';
		var time_meal = '';
		for (var i = new_entities.length - 1; i >= 0; i--) {
			if(typeof new_entities[i].value === 'undefined') {
				// TODO : 이거 응답하는 메시지도 없을때 뭐라고 return할지 entity에 넣어두면 좋겠오
				message = "'" + new_entities[i].name + "'를 알려주세요!";
				my_callback(intent, new_entities, message);
				return ;	// 끝
			}

			switch (new_entities[i].key){
				case 'date' :
					date = new_entities[i].value;
					break;
				case 'time_meal' :
					time_meal = new_entities[i].value;
					break;
			}
		}

		// // TODO: 
		// // 해당 response가 사용자의 의도와 얼마나 부합하는지 확률도 같이 보내줘서 selector가 판별하게 할 수 있을까?
		// // 는 나중에 하자 -.-

		// // 응답을 만들자
	    switch (date) {
	    	case 'today' :
	    		date = moment().format('YYYY-MM-DD');
	    		break;
	    	case 'yesterdat' :
	    		date = moment().subtract(1, 'days').format('YYYY-MM-DD');
	    		break;
	    	case 'tomorrow' :
	    		date = moment().add(1, 'days').format('YYYY-MM-DD');
	    		break;
	    }

	    var yql_query = "/menus/" + date + "/" + time_meal + ".json"
	    console.log(yql_query);

		function handleResponse(response) {
			var serverData = '';
			response.on('data', function (chunk) {
				serverData += chunk;
			});
			response.on('end', function () {
				console.log("Response Status:", response.statusCode);
				console.log("Response Headers:", response.headers);
				console.log("Response ServerData:",serverData);

				var menu = JSON.parse(serverData);
				var idx = 0;
				message += date + "의 " + time_meal+"은 다음과 같습니다.\n"
				for (var m in menu) {
					if(menu[m].trim() !== '&nbsp;'){
						if(idx > 0) message += '\n';
						message += m+":"+menu[m];
						idx++;
					}
				}
				message += "\n식사 맛있게 하십쇼 (__)";

				my_callback(intent, new_entities, message);
			});
		}

		https.request({
			host : 'serendip-test.firebaseio.com',
			port : 443,
			path : yql_query
		}, function(response){
			handleResponse(response);
		}).end();

	});
}