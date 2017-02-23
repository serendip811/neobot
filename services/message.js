// services/message.js
var UserMessageModel = require('../models/user_message');
var IntentService = require('../services/intent');
var EntityService = require('../services/entity');
var PosService = require('../services/pos');

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

    var responseCandidates = [{ intents : intents, entities : entities}, {}];

    callback(responseCandidates)

}