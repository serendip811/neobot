// services/context.js
var ContextModel = require('../models/context');

// Context를 가져온다
exports.getContext = function(req, callback){
    console.log("Context getContext");
    user_key = req.body.user_key;

    // context 가져올때 시간도 체크를 해야하지 않을까? 최근 몇분의 context만 가져오도록.
    ContextModel.findOne({user_key : user_key}, null, { sort : {date:-1} }, function(err, context){
        console.log(context);
        if(context == null || typeof context === 'undefined'){
            context = {
                user_key : user_key,
                intent : {},
                entities : [],
            }
        }
	    callback(context);
    });
}

exports.setContext = function(user_key, intent, entities, callback){
    console.log("Context setContext");
    var context = new ContextModel({
    	user_key : user_key,
    	intent: intent,
    	entities : entities
    });

    // 일단 update아니고 insert...
    var promise = context.save();

    promise.then(function(doc){
        callback();
    });
}