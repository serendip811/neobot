// services/message.js
var IntentService = require('../services/intent');
var EntityService = require('../services/entity');
var PosService = require('../services/pos');
var ResponseService = require('../services/response');

// 1. 자연어 처리해서 명사만 뽑는다.
// 2. intent를 분류한다.
// 3. entity를 인식한다.
exports.preProcess = function(req, callback){
    console.log("Message preProcess");
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
        console.log("   intent from context!("+context.intent.key+")");
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

exports.fillIntentEntites = function(intent, entities, context, callback){
    console.log("Message fillIntentEntites");
    // 우리가 채워줄 새로운 entity 배열
    var new_entities = [];

    // db에서 가져온 애랑, context에 넣어서 가져온 애랑 꺼내는 방법이 다르다 ㅠ_ㅠ
    // context에 넣을때도 model 객체로 넣는거로 바꾸면 될듯?
    var entity_keys = {};
    if(typeof intent.get === 'function')
        entity_keys = intent.get('entity_keys');
    else
        entity_keys = intent.entity_keys;

    // 비동기 callback을 챙기기 위해...
    // new_entities를 받아서 잘 채워지면 callback 실행해주는 놈을 만들자
    var my_callback = function(new_entities){
        // 잘 채워졌으면 callback 실행해주자.
        if(entity_keys.length === new_entities.length) {
            callback(new_entities);    
        }
    }

    // intent에 필요한 entitiy key들을 돌면서
    for (var i = entity_keys.length - 1; i >= 0; i--) {
        // 새롭게 만들 entity
        var new_entity = {};
        // message의 entity들 중에 있는지 확인해보자
        for (var j = entities.length - 1; j >= 0; j--) {
            if(entity_keys[i] === entities[j].key){
                // 오, 있으면 이놈을 new_entity로 사용
                new_entity = entities[j];
                console.log("   entity from request!("+new_entity.key+" : "+new_entity.value+")");
                break;
            }
        }

        // 필요한 new entity가 없으면... context를 뒤져보자
        if(Object.keys(new_entity).length === 0){
            // context가 있으면,
            if(typeof context === 'object'){
                // context의 entity들을 뒤져볼까?
                for (var j = context.entities.length - 1; j >= 0; j--) {
                    if(entity_keys[i] === context.entities[j].key){
                        // 오, 있으면 이놈을 new_entity로 사용
                        new_entity = context.entities[j];
                        console.log("   entity from context!("+new_entity.key+" : "+new_entity.value+")");
                        break;
                    }
                }
            }
        }

        // 이렇게 까지 했는데 없으면..
        if(Object.keys(new_entity).length === 0){
            // entity를 가져와서 그냥 넣자
            // default_value가 있으면 그걸 value로, 없으면 그냥 없는 채루 놔둔다.
            EntityService.getEntity(entity_keys[i], function(entity){
                if(typeof entity === 'object' && typeof entity.default_value !== 'undefined'){
                    new_entity = {
                        key: entity.key,
                        name: entity.name,
                        value: entity.default_val ? entity.default_val : undefined
                    };

                    console.log("   entity from default_value!("+new_entity.key+" : "+new_entity.value+")");
                    // 클로저의 묘미
                    new_entities.push(new_entity);
                    // 이 콜백 함수는 비동기함수가 다 끝나고 new_entities가 다 채워졌을때만 동작하지.
                    my_callback(new_entities);
                }
            });
        } else {
            // 그 전에 잘 채웠으면 그냥 넣어준다.
            new_entities.push(new_entity);
        }
    }

    // 끝났으면 callback 실행
    // 물론 default_value 채우기 위한 놈이 비동기로 수행중이라면 아무일도 안한다.
    my_callback(new_entities);

}