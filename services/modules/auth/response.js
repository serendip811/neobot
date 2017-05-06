// services/resonse/stock.js
var MessageService = require('../../../services/message');
var AuthcodeModel = require('./models/authcode');
var UserkeyModel = require('./models/userkey');
var http = require('http');
var iconv = require('iconv-lite');

exports.getResponses = function(intent, entities, pos, context, callback){
	console.log("auth getResponses");

	var my_callback = function(intent, entities, message, step){
		var response = {};

		if(step < 999){
			entities.push({
	            key: "step",
	            name: "step",
	            value: step
	        });
			response.type = "text";
			response.buttons = null;
		}

		response.intent = intent;
		response.entities = entities; // new_entities를 넣어준다.
		response.message = message; // new_entities를 넣어준다.

		callback(response);
	}
	// 필요한 entities를 채우고...
	MessageService.fillIntentEntites(intent, entities, context, function(new_entities){
		var message = '';

		if(context.intent.key === "auth" 
			&& context.entities.length > 0
			&& context.entities[0].key === "step"){
			
			// step.1 입력받은 AD계정 저장하고 인증코드 보내기
			if(context.entities[0].value === 1){

				// 입력받은 AD계정
				var ADID = "";
				for (var i = 0; i < pos.length; i++) {
					if(pos[i][1] === "SL" || pos[i][1] === "SN"|| pos[i][1] === "SY"){
						if(pos[i][0] !== "neowiz" && pos[i][0] !== "com"){
							ADID += pos[i][0];
						}else{
							break;
						}
					} else {
						break;
					}
				}

				if(ADID[ADID.length-1] === "@")
					ADID = ADID.slice(0, -1);

				if(ADID === ""){
					// 제대로 입력해주세요.
					my_callback(intent, new_entities, "네오위즈 AD계정을 정확히 입력해주세요. ('취소'라고 얘기해주시면 처음으로 돌아갑니다.)", 1);
					return ;
				}

				// 기 등록된 ADID가 있는지
				UserkeyModel.findOne({neowiz_id : ADID}, function(err, userkey){
					if(err) return res.status(500).send({error: 'database failure'});
					if(userkey){
						my_callback(intent, new_entities, "이미 해당 계정("+ADID+")에 연결된 카카오 계정이 존재합니다. 1:1대화로 관리자에게 문의해주세요.", 999);
						return ;
					} else {
						// 없는 경우에만 고고

						// 임의의 키 발행
						// 100~999
				    	var auth_code = Math.floor(Math.random() * 899) + 100;

						// authcode에 넣어두기
					    var authcode = new AuthcodeModel({
					    	user_key : context.user_key,
					    	neowiz_id : ADID,
					    	neowiz_mail : ADID+"@neowiz.com",
					    	auth_code : auth_code
					    });
					    authcode.save();

						// 이메일 발송하기


						my_callback(intent, new_entities, ADID+"@neowiz.com 으로 인증코드를 발송하였습니다. 인증코드를 입력해주세요.", 1);
						return ;
					}
				});

			} else if (context.entities[0].value === 2) {
				// 인증코드 확인하기

				// 입력받은 인증코드
				var auth_code = "";
				for (var i = pos.length - 1; i >= 0; i--) {
					if(pos[i][1] === "SN"){
						auth_code = pos[i][0];
					}
				}

				AuthcodeModel.findOne({user_key : context.user_key}, {"date" : -1}, function(err, authcode){
					if(err) return res.status(500).send({error: 'database failure'});
					if(authcode){
						if(authcode.auth_code === auth_code){
							//인증 성공
						    var userkey = new UserkeyModel({
						    	user_key : context.user_key,
						    	neowiz_id : authcode.neowiz_id,
						    	neowiz_mail : authcode.neowiz_mail
						    });
						    userkey.save();

							my_callback(intent, new_entities, "인증에 성공하였습니다 (__)", 999);
							return ;
						} else {
							my_callback(intent, new_entities, "올바르지 않은 코드입니다. 다시 입력해주세요.", 2);
							return ;
						}
					} else {
						my_callback(intent, new_entities, "인증코드가 만료되었습니다. AD계정을 다시 알려주시겠어요?", 1);
						return ;
					}
			    });
			}

		} else {
			my_callback(intent, new_entities, "네오위즈 AD계정을 알려주시겠어요? ('취소'라고 얘기해주시면 처음으로 돌아갑니다.)", 1);
			return ;
		}
	});
}
