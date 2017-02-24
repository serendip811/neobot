// services/message.js
var UserMessageModel = require('../models/user_message');
var IntentService = require('../services/intent');
var EntityService = require('../services/entity');
var PosService = require('../services/pos');
var ResponseService = require('../services/response');

// 1. 자연어 처리해서 명사만 뽑는다.
// 2. intent를 분류한다.
// 3. entity를 인식한다.
exports.preProcess = function(req, callback){
    var user_key = req.body.user_key;
    var type = req.body.type;   // text
    var content = req.body.content;

    // 자연어 처리해서 명사만 뽑자
    PosService.nouns(content, function(err, nouns){

        // 가능한 Intent들 가져오기
        IntentService.classfication(nouns, function(intents){

            // 가능한 Entity들 가져오기
            EntityService.recognition(nouns, function(entities){

                callback(intents, entities);

            });
        });
    });
}

// 1. 기존 context를 가져온다.
// 2. context와 intents, entites를 섞어서 응답 후보들을 만든다.
exports.CandidateResponseGenerator = function(intents, entities, context, callback){
    console.log("Message CandidateResponseGenerator");

    var itemProcessed = 0;
    var responseCandidates = [];

    // 만약에 intents가 없는 경우에는 context의 intent를 뒤져서 context의 intent를 넣어주자
    if(intents.length === 0){
        intents.push(context.intent);
    }

    for (var i = intents.length - 1; i >= 0; i--) {
        var intent = intents[i];
        ResponseService.getResponses(intent, entities, context, function(responseCandidate){
            responseCandidates.push(responseCandidate);

            itemProcessed++;
            if(itemProcessed === intents.length){
                callback(responseCandidates);
            }
        });
    }
}