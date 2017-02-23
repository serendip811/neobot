// controllers/index.js
var KeyboardModel = require('../models/keyboard');
var MessageService = require('../services/message');
var ContextService = require('../services/context');
var ResponseService = require('../services/response');

// https://hackernoon.com/chatbot-architecture-496f5bf820ed#.a5gtdbotv
// 요기의 Architecture with response selection 이부분을 참고 함.

module.exports = function(app)
{

    app.get('/', function (req, res) {
        res.send('Hello Chatbot!');
    });

    // GET keyboard
    app.get('/keyboard', function(req,res){
        console.log("/keyboard");
        KeyboardModel.findOne(function(err, keyboards){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(keyboards);
        });
    });

    // POST message
    app.post('/message', function(req,res){
        console.log("/message");

        // 전처리 (intent랑 entities 가져오기)
        MessageService.preProcess(req, function(intents, entities){
            // Context가져오기
            ContextService.getContext(req, function(context){
                // 응답 후보 목록 만들기
                MessageService.CandidateResponseGenerator(intents, entities, context, function(responseCandidates){
                    //응답 선택하기
                    ResponseService.selector(responseCandidates, context, function(response){
                        res.json(response);
                    });
                });
            });
        });
    });
}