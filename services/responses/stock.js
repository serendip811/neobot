// services/resonse/stock.js
var http = require('http');

// TODO: 
// 주식 정보 가져와서 뿌려주는 부분 구현하기
exports.getResponses = function(intent, entities, context, callback){
	console.log("stock getResponses");
	var response = {};

	http.request({
		host : 'www.google.co.kr', 
		port : 443,
		path : '/async/finance_chart_data?async=q:095660,x:KOSDAQ,p:1d,i:600,_fmt:json'
	}, function(response){
		console.log(response);

		response.intent = intent;
		response.entities = entities;
		response.message = "안녕! 주식!";

		callback(response);
	}).end();

    // result = urllib.urlopen(baseurl).read()
    // result = result[5:len(result)]
    // stock = json.loads(result, encoding='utf-8')
    // value = stock.get("tnv").get("value")
    // value = json.loads(value, encoding='utf-8')
    // v = value.get("v")
    // speech = "[NEOWIZ GAMES] " + str(v[0][-1])
    // return speech






}