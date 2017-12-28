// services/resonse/stock.js
var MessageService = require('../../../services/message');
var UserkeyModel = require('../auth/models/userkey');
var firebase = require("firebase");
var fs = require("fs");
var os = require("os");

exports.getResponses = function(intent, entities, pos, context, callback){
	console.log("portal getResponses");

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

		// 인증 정보 있는지
		UserkeyModel.findOne({user_key : context.user_key}, function(err, userkey){
			if(err) return res.status(500).send({error: 'database failure'});
			if(userkey){

				fs.exists(os.homedir()+'/craw/users/'+userkey.neowiz_id, function(exists) {
					if(exists) {
						// 구독해지
						fs.unlink(os.homedir()+'/craw/users/'+userkey.neowiz_id, (err) => {
						});
						my_callback(intent, new_entities, "포털에 등록되는 새글을 메일로 받아보지 않습니다.");
					} else {
						// 구독
						fs.writeFile(os.homedir()+'/craw/users/'+userkey.neowiz_id, '', (err) => {
						});
						my_callback(intent, new_entities, "포털에 등록되는 새글을 메일로 받아봅니다.");
					}
				});
				return ;
			} else {
				my_callback(intent, new_entities, "네오위즌 인증을 먼저 진행해주세요.");
				return ;
			}
		});
	});
}
