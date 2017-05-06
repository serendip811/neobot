// controllers/index.js
var ButtonService = require('../services/button');
var MessageService = require('../services/message');
var ContextService = require('../services/context');
var ResponseService = require('../services/response');

// https://hackernoon.com/chatbot-architecture-496f5bf820ed#.a5gtdbotv
// 요기의 Architecture with response selection 이부분을 참고 함.

// heroku와 mecab-ya 관련 issue
// https://github.com/golbin/node-mecab-ya/issues/3

// 각 챗봇 클라이언트에 맞게 request, response 처리하는거는 어떻게 할 수 있을까?

module.exports = function(app)
{

    app.get('/', function (req, res) {
        res.send('Hello Chatbot!');
    });

    // GET keyboard
    app.get('/keyboard', function(req,res){
        console.log("GET /keyboard");

        ButtonService.getKeyboard(function(keyboards){
            res.json(keyboards);
        });
    });

    // POST message
    app.post('/message', function(req,res){
        console.log("POST /message");

        // 전처리 (intent랑 entities 가져오기)
        MessageService.preProcess(req, function(intents, entities, nouns, pos){
            // Context가져오기
            ContextService.getContext(req, function(context){
                // 응답 후보 목록 만들기
                MessageService.CandidateResponseGenerator(intents, entities, nouns, pos, context, function(responseCandidates){
                    //응답 선택하기
                    ResponseService.selector(responseCandidates, context, function(response){
                        // TODO: 여기는 그냥 리턴할지 버튼, 타입 이런거 맞춰 리턴할지
                        // 일단 카카오 형식으로 리턴해주자

                        var kakao_response = {};
                        kakao_response.messsage = { text : response.message};

                        // text가 아닐때 keyboard넣어주고, text면 생략
                        if(response.type !== "text")
                            kakao_response.keyboard = response.buttons;

                        res.json(kakao_response);
                    });
                });
            });
        });
    });
}