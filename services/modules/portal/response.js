// services/resonse/stock.js
var MessageService = require('../../../services/message');
var PortalModel = require('./models/portal');
var UserkeyModel = require('../auth/models/userkey');
var firebase = require("firebase");
var iconv = require('iconv-lite');

var config = {
	apiKey: "AIzaSyACMwQ-XUgtDkNmtE6iWSiYWxu8m2ffE_8",
	authDomain: "serendip-test.firebaseapp.com",
	databaseURL: "https://serendip-test.firebaseio.com",
	projectId: "serendip-test",
	storageBucket: "serendip-test.appspot.com",
	messagingSenderId: "699720679397"
};
firebase.initializeApp(config);


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

		// 기 등록된 ADID가 있는지
		UserkeyModel.findOne({userkey : context.user_key}, function(err, userkey){
			if(err) return res.status(500).send({error: 'database failure'});
			if(userkey){
				PortalModel.findOne({neowiz_mail : userkey.neowiz_mail}, function(err, portal){
					if(err) return res.status(500).send({error: 'database failure'});
					if(portal) {
						if(portal.subscription) {
							// 구독 해지
						    // var my_portal = new PortalModel({
						    // 	neowiz_mail : userkey.neowiz_mail,
						    // 	subscription : false
						    // });
						    // my_portal.save();
							firebase.database().ref('users/' + userkey.neowiz_mail).remove();

						    my_callback(intent, new_entities, "네오위즈 포털 새글 알림을 받지 않습니다.");
						} else {
							// 구독
						    // var my_portal = new PortalModel({
						    // 	neowiz_mail : userkey.neowiz_mail,
						    // 	subscription : true
						    // });
						    // my_portal.save();
							firebase.database().ref('users/' + userkey.neowiz_mail).set({
								subscription: true
							});
						    my_callback(intent, new_entities, "네오위즈 포털 새글 알림을 받습니다.");
						}

					}	else {
						// 구독
					    // var my_portal = new PortalModel({
					    // 	neowiz_mail : userkey.neowiz_mail,
					    // 	subscription : true
					    // });
					    // my_portal.save();
						firebase.database().ref('users/' + userkey.neowiz_mail).set({
							subscription: true
						});
					    my_callback(intent, new_entities, "네오위즈 포털 새글 알림을 받습니다.");
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
