// services/resonse/stock.js
var MessageService = require('../../../services/message');

// 주식 정보 가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("coffee getResponses");

	var my_callback = function(intent, entities, name, sentence){
		var response = {};
		response.intent = intent;
		response.entities = entities; // new_entities를 넣어준다.
		response.message = name + sentence; // new_entities를 넣어준다.
		response.buttons = [name+"님과 약속을 잡을래요!","다른분과 커피 마실게요..." ,"처음으로 돌아갈게요."];

		callback(response);
	}
	// 필요한 entities를 채우고...
	MessageService.fillIntentEntites(intent, entities, context, function(new_entities){
		var message = '';

    	var namelist = ["기술본부 배태근", "기술본부 이아영", "인프라실 박효신", "시스템팀 김동하", "시스템팀 김승환", "시스템팀 김재훈", "시스템팀 김태관", "시스템팀 류상일", "시스템팀 마성민", "시스템팀 문재우", "시스템팀 변재관", "시스템팀 윤예지", "시스템팀 이중재", "시스템팀 전선필", "시스템팀 최귀남", "시스템팀 홍성룡", "DB기술팀 강한글", "DB기술팀 김종원", "DB기술팀 박필호", "DB기술팀 정진환", "DB기술팀 정지희", "DB기술팀 조길주", "DB기술팀 최의건", "DB기술팀 홍기선", "DB기술팀 황현모", "블레스개발팀 배한상", "블레스개발팀 김보성", "블레스개발팀 류제욱", "블레스개발팀 장혜선", "게임플랫폼팀 윤재진", "게임플랫폼팀 김명진", "게임플랫폼팀 이성주", "게임플랫폼팀 이용현", "플랫폼개발팀 이승철", "플랫폼개발팀 권영진", "플랫폼개발팀 김경환(redjade)", "플랫폼개발팀 김경환(uno7754)", "플랫폼개발팀 김예준", "플랫폼개발팀 김형근", "플랫폼개발팀 김형도", "플랫폼개발팀 신광우", "플랫폼개발팀 이성제", "플랫폼개발팀 이승철", "플랫폼개발팀 장군수", "플랫폼개발팀 장영일", "플랫폼기획팀 이영헌", "플랫폼기획팀 곽지혜", "플랫폼기획팀 김지혜", "플랫폼기획팀 김형곤", "플랫폼기획팀 박정수", "스마트워크팀 임덕식", "스마트워크팀 김민우", "스마트워크팀 김원성", "스마트워크팀 정효미", "스마트워크팀 최선희", "웹개발팀 정병태", "웹개발팀 김진실", "웹개발팀 최준"]
    	var sentencelist = ["님과 커피 한잔 해보세요 :)", "님과 커피한잔 어때요?", "님이 커피 마시고 싶대요~"]

    	var rand_idx = Math.floor(Math.random() * namelist.length);

    	var name = namelist[rand_idx];
    	var sentence = sentencelist[Math.floor(Math.random() * sentencelist.length)];

    	my_callback(intent, new_entities, name, sentence);
	});
}