// services/resonse/menu.js
var MessageService = require('../../services/message');
var https = require('https');
var moment = require('moment');
var fs = require('fs');
var os = require('os');

// TODO : 여기 menu,stock 등.. response에서 공통부분 있는거 빼서 정리하자.
// 아마 response.js로 넣을 수 있을듯

// 네오위즈 식사 메뉴가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("menu getResponses");

	var my_callback = function(intent, entities, message, time_meal){
		var response = {};
		response.intent = intent;
		response.entities = entities; // new_entities를 넣어준다.
		response.message = message; // new_entities를 넣어준다.
		if(time_meal == "breakfast") {
			response.buttons = ["점심 식사 메뉴도 알려주세요", "저녁 식사 메뉴는요?" ,"처음으로 돌아갈게요."];	
		} else if(time_meal == "lunch") {
			response.buttons = ["아침 식사 메뉴도 알려주세요", "저녁 식사 메뉴는요?" ,"처음으로 돌아갈래요."];	
		} else {
			response.buttons = ["아침 식사 메뉴도 알려주세요", "점심 식사 메뉴는요?" ,"처음으로 돌아갑시다요."];	
		}

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
			// if(typeof new_entities[i].value === 'undefined') {
			// 	// TODO : 이거 응답하는 메시지도 없을때 뭐라고 return할지 entity에 넣어두면 좋겠오
			// 	message = "'" + new_entities[i].name + "'를 알려주세요!";
			// 	my_callback(intent, new_entities, message);
			// 	return ;	// 끝
			// }

			switch (new_entities[i].key){
				case 'date' :
					date = new_entities[i].value;
					break;
				case 'time_meal' :
					time_meal = new_entities[i].value;
					break;
			}
		}

		if(date == null || date == '' || date == undefined){
			date = 'today';
		}
		if(time_meal == null || time_meal == '' || time_meal == undefined){
			if(moment().format('HH') < 10) {
				time_meal = 'breakfast';
			} else if(moment().format('HH') < 14){
				time_meal = 'lunch';
			} else if(moment().format('HH') < 20){
				time_meal = 'dinner';
			} else {
				time_meal = 'lunch';
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
	    	case 'yesterday' :
	    		date = moment().subtract(1, 'days').format('YYYY-MM-DD');
	    		break;
	    	case 'tomorrow' :
	    		date = moment().add(1, 'days').format('YYYY-MM-DD');
	    		break;
	    }

		var file_path = os.homedir()+'/craw/menus/'+date+'.menu';
	    console.log(file_path);
		fs.readFile(file_path, 'utf8', function(err, data){
			if(err) {
				console.log(err);
				message = "배치가 수행되지 않았습니다. 관리자에게 알려주세요.ㅠㅠ";
				my_callback(intent, new_entities, message, time_meal);
				return ;
			}

			var menu = JSON.parse(data);
			menu = menu[time_meal];

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

			my_callback(intent, new_entities, message, time_meal);


		});
	});
}
