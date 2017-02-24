// services/resonse/menu.js

// 네오위즈 식사 메뉴가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("menu getResponses");
	var response = {};

	// TODO: 
	// intent에 필요한 entity들이 있는지 확인하고
	// 부족한 애들은 context에 있는지 확인하고
	// 그래도 없으면 기본값으로 채우고
	// <- 이부분 까지는 공통 logic으로 빼자

	// TODO: 
	// 몇가지 entity가 부족한 경우에는 어떻게 response하면 좋을까?
	// <- 없는 entity의 경우 응답할 것들도 정의가 되어야 함.

	// TODO: 
	// 해당 response가 사용자의 의도와 얼마나 부합하는지 확률도 같이 보내줘서 selector가 판별하게 할 수 있을까?

	// TODO: 
	// 응답을 만들어서 callback
	response.intent = intent;
	response.entities = entities;

	callback(response);

}