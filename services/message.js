// services/message.js
var UserMessageModel = require('../models/user_message');
var IntentService = require('../services/intent');
var ContextService = require('../services/context');

exports.process = function(req, callback){
    var user_key = req.body.user_key;
    var type = req.body.type;   // text
    var content = req.body.content;

    IntentService.getIntent(content, function(intent){
        console.log("intent : " + intent);

        ContextService.getContexts(content, function(contexts){
            var result = {};
            result.intent = intent;
            result.contexts = contexts;
            callback(result);
        });
        
    });

}